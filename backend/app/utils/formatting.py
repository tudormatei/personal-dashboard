from datetime import datetime
import json
from typing import List
import pandas as pd
import numpy as np


def round_dataframe(df: pd.DataFrame, decimals: int = 1):
    df = df.copy()

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].round(decimals)

    return df


def serialize_dataframe_for_json(
    df: pd.DataFrame, decimals: int = 1, date_only: bool = True
) -> List[dict]:
    df = df.copy()

    numeric_cols = df.select_dtypes(include=[np.number]).columns

    df[numeric_cols] = df[numeric_cols].map(
        lambda x: None if pd.isna(x) or np.isinf(x) or abs(x) > 1e308 else x
    )
    df[numeric_cols] = df[numeric_cols].round(decimals)

    if date_only:
        datetime_cols = df.select_dtypes(include=["datetime64[ns]"]).columns
        for col in datetime_cols:
            df[col] = df[col].dt.date

    return json.loads(df.to_json(orient="records", date_format="iso"))


def yyyymmdd_to_iso(date_str: str) -> str:
    date_only = date_str.split(";")[0]
    try:
        dt = datetime.strptime(date_only, "%Y%m%d")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        raise ValueError(f"Invalid date format: {date_str}, expected YYYYmmDD")


def iso_to_yyyymmdd(date_str: str) -> str:
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return dt.strftime("%Y%m%d")
    except ValueError:
        raise ValueError(f"Invalid date format: {date_str}, expected YYYY-MM-DD")
