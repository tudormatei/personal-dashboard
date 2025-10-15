from sklearn.linear_model import LinearRegression
import io
import xml.etree.ElementTree as ET
import pandas as pd
from typing import List, Tuple

from ..utils.formatting import serialize_dataframe_for_json
from ..constants.health import (
    AVERAGE_DAYS_PER_MONTH,
    AVERAGE_LIFTING_CALORIES,
    KCALPERKG,
    LIFTING_SESSIONS_PER_WEEK,
    MACRO_TYPES,
    RELEVANT_RECORD_TYPES,
    RELEVANT_WORKOUT_TYPES,
)
from ..repositories.health import (
    fetch_records,
    fetch_workouts,
    insert_health_records,
    insert_workouts,
)
from ..models.health import HealthRecord, WorkoutSession


def process_health_file(contents: bytes) -> int:
    records, workouts = parse_apple_health_xml(io.BytesIO(contents))

    insert_health_records(records)
    insert_workouts(workouts)

    return {"imported": (len(records) + len(workouts))}


def parse_apple_health_xml(
    file,
) -> Tuple[List[HealthRecord], List[WorkoutSession]]:
    tree = ET.parse(file)
    root = tree.getroot()
    records: List[HealthRecord] = []
    workouts: List[WorkoutSession] = []

    for record in root.findall("Record"):
        rtype = record.attrib.get("type")
        if rtype not in RELEVANT_RECORD_TYPES:
            continue

        try:
            value = float(record.attrib.get("value"))
        except (TypeError, ValueError):
            continue

        date = pd.to_datetime(record.attrib["startDate"])
        date = date.tz_localize(None) if date.tzinfo else date

        records.append(HealthRecord(type=rtype, date=date, value=value))

    for workout in root.findall("Workout"):
        wtype = workout.attrib.get("workoutActivityType")
        if wtype not in RELEVANT_WORKOUT_TYPES:
            continue

        try:
            duration = float(workout.attrib.get("duration"))
        except (TypeError, ValueError):
            continue

        start = pd.to_datetime(workout.attrib.get("startDate"))
        start = start.tz_localize(None) if start.tzinfo else start

        end = pd.to_datetime(workout.attrib.get("endDate"))
        end = end.tz_localize(None) if end.tzinfo else end

        workouts.append(
            WorkoutSession(
                type=wtype,
                start=start,
                end=end,
                duration_min=duration,
            )
        )

    return records, workouts


def get_weight_stats(
    start_date,
    end_date,
    ma_windows,
):
    ma_windows: Tuple[int, ...] = tuple(map(int, ma_windows.split(",")))

    records = fetch_records(
        record_type="HKQuantityTypeIdentifierBodyMass",
        start_date=start_date,
        end_date=end_date,
    )

    df = pd.DataFrame(records)
    if df.empty:
        return None

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])

    if df.empty:
        return []

    grouped = df.groupby(df["date"].dt.date)
    df_daily = pd.DataFrame(
        {"date": grouped["date"].min().values, "value": grouped["value"].mean().values}
    ).sort_values("date")

    for window in ma_windows:
        df_daily[f"ma{window}"] = df_daily["value"].rolling(window).mean()

    return serialize_dataframe_for_json(df_daily, 1)


def estimate_maintenance(
    start_date,
    end_date,
    min_daily_calories,
    calories_ma_window,
):
    weight_records = fetch_records(
        record_type="HKQuantityTypeIdentifierBodyMass",
        start_date=start_date,
        end_date=end_date,
    )
    calorie_records = fetch_records(
        record_type="HKQuantityTypeIdentifierDietaryEnergyConsumed",
        start_date=start_date,
        end_date=end_date,
    )

    if not weight_records or not calorie_records:
        return None

    df_w = pd.DataFrame(weight_records)
    df_c = pd.DataFrame(calorie_records)

    df_w["date"] = pd.to_datetime(df_w["date"]).dt.date
    df_c["date"] = pd.to_datetime(df_c["date"]).dt.date
    df_w.rename(columns={"value": "weight"}, inplace=True)
    df_c.rename(columns={"value": "calories"}, inplace=True)

    df_w_daily = df_w.groupby("date", as_index=False)["weight"].mean()
    df_c_daily = df_c.groupby("date", as_index=False)["calories"].sum()

    df = pd.merge(df_c_daily, df_w_daily, on="date", how="inner")

    df = df[df["calories"] >= min_daily_calories]
    df = df.sort_values("date")

    if len(df) < 2:
        return None

    if calories_ma_window:
        df["calories_ma"] = (
            df["calories"]
            .rolling(window=calories_ma_window, min_periods=1, center=True)
            .mean()
        )
    else:
        df["calories_ma"] = df["calories"]

    df["day_num"] = pd.to_datetime(df["date"]).map(pd.Timestamp.toordinal)
    X = df[["day_num"]]
    y = df["weight"]

    model = LinearRegression().fit(X, y)
    slope_kg_per_day = model.coef_[0]
    daily_adjustment = slope_kg_per_day * KCALPERKG

    pred_start = model.predict(pd.DataFrame({"day_num": [df["day_num"].iloc[0]]}))[0]
    pred_end = model.predict(pd.DataFrame({"day_num": [df["day_num"].iloc[-1]]}))[0]

    avg_daily_calories = df["calories_ma"].mean()
    daily_exercise_calories = (LIFTING_SESSIONS_PER_WEEK * AVERAGE_LIFTING_CALORIES) / 7
    maintenance_calories = (
        avg_daily_calories + daily_exercise_calories - daily_adjustment
    )

    return {
        "estimated_maintenance_calories": round(maintenance_calories),
        "kg_per_day": round(slope_kg_per_day, 2),
        "kg_per_week": round(slope_kg_per_day * 7, 2),
        "kg_per_month": round(slope_kg_per_day * AVERAGE_DAYS_PER_MONTH, 2),
        "avg_daily_calories": round(avg_daily_calories),
        "pred_start_weight": round(pred_start, 2),
        "pred_end_weight": round(pred_end, 2),
        "total_weight_change": round(pred_end - pred_start, 2),
        "days_used": len(df),
    }


def get_macros_stats(
    start_date,
    end_date,
    ma_windows,
):

    ma_windows: Tuple[int, ...] = tuple(map(int, ma_windows.split(",")))

    result = {}

    for nutrient_name, record_type in MACRO_TYPES.items():
        records = fetch_records(
            record_type=record_type, start_date=start_date, end_date=end_date
        )
        stats = compute_nutrient_stats(
            records,
            ma_windows=ma_windows,
        )
        if not stats:
            continue

        result[nutrient_name] = stats

    if not len(result):
        return None

    return result


def compute_nutrient_stats(
    records,
    ma_windows,
):
    df = pd.DataFrame(records)
    if df.empty:
        return None

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])
    df["day"] = df["date"].dt.date

    grouped = df.groupby("day")
    df_daily = pd.DataFrame(
        {
            "date": grouped["day"].min().values,
            "value": grouped["value"].sum().values,
        }
    ).sort_values("date")

    for window in ma_windows:
        df_daily[f"ma{window}"] = df_daily["value"].rolling(window).mean()

    period_summary = {
        "total": round(df_daily["value"].sum(), 0),
        "average_per_day": round(df_daily["value"].mean(), 0),
        "min_per_day": round(df_daily["value"].min(), 0),
        "max_per_day": round(df_daily["value"].max(), 0),
        "std_dev": round(df_daily["value"].std(), 0),
    }

    return {
        "daily": serialize_dataframe_for_json(df_daily, 0),
        "summary": period_summary,
    }


def get_workout_stats(
    start_date,
    end_date,
):

    records = fetch_workouts(
        record_type="HKWorkoutActivityTypeTraditionalStrengthTraining",
        start_date=start_date,
        end_date=end_date,
    )

    df = pd.DataFrame(records)
    if df.empty:
        return None

    df["start"] = pd.to_datetime(df["start"], errors="coerce")
    df["end"] = pd.to_datetime(df["end"], errors="coerce")
    df["duration_min"] = pd.to_numeric(df["duration_min"], errors="coerce")
    df = df.dropna(subset=["start", "duration_min"])

    df_daily = df.groupby(df["start"].dt.date)["duration_min"].sum().reset_index()
    df_daily.rename(columns={"start": "date", "duration_min": "duration"}, inplace=True)
    df_daily["duration"] = df_daily["duration"].round(2)
    df_daily["date"] = pd.to_datetime(df_daily["date"]).dt.strftime("%Y-%m-%dT%H:%M:%S")

    total_sessions = int(df.shape[0])
    total_duration = float(df["duration_min"].sum().round(2))
    avg_session = float(df["duration_min"].mean().round(2))
    longest_session = float(df["duration_min"].max().round(2))

    weekday_order = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    df["weekday"] = pd.Categorical(
        df["start"].dt.day_name(), categories=weekday_order, ordered=True
    )
    sessions_per_weekday = df["weekday"].value_counts().reindex(weekday_order).to_dict()

    df["year"] = df["start"].dt.isocalendar().year
    df["week"] = df["start"].dt.isocalendar().week
    sessions_per_week = df.groupby(["year", "week"]).size().to_dict()
    sessions_per_week = {
        f"{year}-W{week}": v for (year, week), v in sessions_per_week.items()
    }

    df["month"] = df["start"].dt.to_period("M")
    sessions_per_month = df.groupby("month").size().to_dict()
    sessions_per_month = {str(k): int(v) for k, v in sessions_per_month.items()}

    full_dates = pd.date_range(start=df_daily["date"].min(), end=df_daily["date"].max())
    workout_days = pd.Series(0, index=full_dates)
    workout_days[df_daily["date"]] = 1

    max_streak = 0
    current_streak = 0
    rest_days_allowed = 1
    rest_count = 0

    for val in workout_days:
        if val == 1:
            current_streak += 1 + rest_count
            rest_count = 0
        else:
            if rest_count < rest_days_allowed:
                rest_count += 1
            else:
                current_streak = 0
                rest_count = 0
        max_streak = max(max_streak, current_streak)

    return {
        "daily_stats": serialize_dataframe_for_json(df_daily, 0),
        "total_sessions": total_sessions,
        "total_duration_min": round(total_duration, 0),
        "avg_session_duration_min": round(avg_session, 0),
        "longest_session_min": round(longest_session, 0),
        "sessions_per_weekday": sessions_per_weekday,
        "sessions_per_week": sessions_per_week,
        "sessions_per_month": sessions_per_month,
        "longest_streak_days": max_streak,
    }
