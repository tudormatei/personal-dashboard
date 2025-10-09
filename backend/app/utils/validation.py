from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status


def validate_iso_date(
    date_str: Optional[str], field_name: str = "date"
) -> Optional[str]:
    if date_str is None:
        return None

    try:
        datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ISO date for '{field_name}': {date_str}. Expected format YYYY-MM-DD.",
        )
    return date_str


def validate_ma_windows(ma_windows: str, field_name: str = "ma_windows") -> List[int]:
    try:
        windows = [int(x) for x in ma_windows.split(",")]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{field_name}' must be a comma-separated list of integers.",
        )

    if any(w <= 0 for w in windows):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"All values in '{field_name}' must be greater than 0.",
        )

    return windows
