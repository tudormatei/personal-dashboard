from datetime import date, datetime, timedelta
from typing import Optional

from ..repositories.mastery import (
    delete_activity,
    fetch_activities,
    fetch_activity,
    fetch_activity_history,
    insert_activity,
    update_activity_total_hours,
    upsert_history_entry,
)
from ..schemas.mastery import (
    ActivityCreateRequest,
    ActivityListItem,
    ActivityResponse,
    ActivityStats,
    HistoryEntry,
    LogHoursRequest,
    Milestone,
    NextMilestone,
)
from ..constants.mastery import (
    DEFAULT_MAX_HOURS,
    HOURS_PER_RANK,
    MAX_RANKS,
    MIN_RANKS,
    PROGRESSION_CURVE,
    RANK_LABELS,
)


def pretty_round(value: float) -> float:
    return round(value * 10) / 10


def _format_short(hours: float) -> str:
    if hours >= 1000:
        return f"{hours/1000:g}k"
    return f"{int(hours)}h"


def build_milestones(max_hours: float) -> list[Milestone]:
    rank_count = int(max_hours / HOURS_PER_RANK)
    rank_count = max(MIN_RANKS, min(MAX_RANKS, rank_count))

    milestones = []

    for i in range(1, rank_count + 1):
        progress = (i / rank_count) ** PROGRESSION_CURVE
        hours = max(1, round(progress * max_hours))

        label_index = min(i - 1, len(RANK_LABELS) - 1)
        label = RANK_LABELS[label_index]

        milestones.append(
            Milestone(
                label=label,
                hours=hours,
                short_label=_format_short(hours),
            )
        )

    milestones.append(
        Milestone(
            label="Master",
            hours=max_hours,
            short_label=_format_short(max_hours),
        )
    )

    return sorted(milestones, key=lambda m: m.hours)


def calc_streak(history: list[HistoryEntry]) -> int:
    if not history:
        return 0

    by_date = {entry.date.isoformat(): entry.hours for entry in history}
    streak = 0
    cursor = date.today()

    while True:
        key = cursor.isoformat()
        if by_date.get(key, 0) > 0:
            streak += 1
            cursor -= timedelta(days=1)
        else:
            break

    return streak


def calc_window_hours(history: list[HistoryEntry], days: int) -> float:
    cutoff = date.today() - timedelta(days=days - 1)
    return pretty_round(sum(entry.hours for entry in history if entry.date >= cutoff))


def calc_today_hours(history: list[HistoryEntry]) -> float:
    today = date.today()
    for entry in history:
        if entry.date == today:
            return pretty_round(entry.hours)
    return 0.0


def get_current_level(total_hours: float, milestones: list[Milestone]) -> str:
    reached = [m for m in milestones if total_hours >= m.hours]
    return reached[-1].label if reached else "Not started"


def get_completed_milestones(
    total_hours: float, milestones: list[Milestone]
) -> list[Milestone]:
    return [m for m in milestones if total_hours >= m.hours]


def get_next_milestone(
    total_hours: float,
    milestones: list[Milestone],
) -> Optional[NextMilestone]:
    next_index = next(
        (i for i, m in enumerate(milestones) if total_hours < m.hours), None
    )
    if next_index is None:
        return None

    next_milestone = milestones[next_index]
    previous_milestone_hours = milestones[next_index - 1].hours if next_index > 0 else 0

    band_total = next_milestone.hours - previous_milestone_hours
    band_progress = total_hours - previous_milestone_hours

    progress_pct = min(100, max(0, round((band_progress / band_total) * 100)))
    distance_hours = pretty_round(max(0, next_milestone.hours - total_hours))

    return NextMilestone(
        label=next_milestone.label,
        hours=next_milestone.hours,
        short_label=next_milestone.short_label,
        distance_hours=distance_hours,
        progress_pct=progress_pct,
    )


def build_activity_response(activity_row: dict) -> ActivityResponse:
    milestones = build_milestones(activity_row["max_hours"])
    history_rows = fetch_activity_history(activity_row["id"])

    history = [
        HistoryEntry(
            date=datetime.strptime(row["date"], "%Y-%m-%d").date(),
            hours=pretty_round(row["hours"]),
        )
        for row in history_rows
    ]

    total_hours = pretty_round(activity_row["total_hours"])
    current_level = get_current_level(total_hours, milestones)
    next_milestone = get_next_milestone(total_hours, milestones)
    completed_milestones = get_completed_milestones(total_hours, milestones)

    stats = ActivityStats(
        today_hours=calc_today_hours(history),
        weekly_hours=calc_window_hours(history, 7),
        monthly_hours=calc_window_hours(history, 30),
        streak_days=calc_streak(history),
        remaining_hours=pretty_round(max(activity_row["max_hours"] - total_hours, 0)),
        progress_pct=min(100, round((total_hours / activity_row["max_hours"]) * 100)),
    )

    return ActivityResponse(
        id=activity_row["id"],
        name=activity_row["name"],
        max_hours=pretty_round(activity_row["max_hours"]),
        total_hours=total_hours,
        milestones=milestones,
        history=history,
        current_level=current_level,
        next_milestone=next_milestone,
        stats=stats,
        completed_milestones=completed_milestones,
    )


def create_activity(payload: ActivityCreateRequest) -> ActivityResponse:
    activity_id = insert_activity(
        name=payload.name.strip(),
        max_hours=payload.max_hours or DEFAULT_MAX_HOURS,
        total_hours=payload.starting_hours,
    )

    activity = fetch_activity(activity_id)
    return build_activity_response(activity)


def get_activities() -> list[ActivityListItem]:
    activities = fetch_activities()
    result: list[ActivityListItem] = []

    for activity in activities:
        milestones = build_milestones(activity["max_hours"])
        total_hours = pretty_round(activity["total_hours"])

        result.append(
            ActivityListItem(
                id=activity["id"],
                name=activity["name"],
                max_hours=pretty_round(activity["max_hours"]),
                total_hours=total_hours,
                current_level=get_current_level(total_hours, milestones),
                progress_pct=min(
                    100, round((total_hours / activity["max_hours"]) * 100)
                ),
            )
        )

    return result


def get_activity(activity_id: int) -> Optional[ActivityResponse]:
    activity = fetch_activity(activity_id)
    if not activity:
        return None
    return build_activity_response(activity)


def log_hours(activity_id: int, payload: LogHoursRequest) -> Optional[ActivityResponse]:
    activity = fetch_activity(activity_id)
    if not activity:
        return None

    entry_date = payload.entry_date or date.today()

    upsert_history_entry(
        activity_id=activity_id,
        entry_date=entry_date.isoformat(),
        hours=payload.hours,
    )

    new_total_hours = activity["total_hours"] + payload.hours
    update_activity_total_hours(activity_id, new_total_hours)

    updated_activity = fetch_activity(activity_id)
    return build_activity_response(updated_activity)


def remove_activity(activity_id: int) -> bool:
    activity = fetch_activity(activity_id)
    if not activity:
        return False

    return delete_activity(activity_id)
