from typing import List
from pydantic import BaseModel


class MonteCarloRequest(BaseModel):
    start_value: float
    twr_series: List[dict]
    monthly_deposit: float = 200
    monthly_withdrawal: float = 0
    days_ahead: int = 100
    sims: int = 5000
    target_value: float | None = None
