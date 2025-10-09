from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import date


class AccountInfo(BaseModel):
    currency: Optional[str] = None
    type: Optional[str] = None
    id: Optional[str] = None


class CashReport(BaseModel):
    starting: Optional[float] = None
    ending: Optional[float] = None
    deposits: Optional[float] = None
    withdrawals: Optional[float] = None


class ValueOverTimePoint(BaseModel):
    date: date
    cash: float
    total: float


class StatementFund(BaseModel):
    amount: float
    symbol: str
    date: date
    activityCode: Optional[str] = None
    activityDescription: Optional[str] = None


class OpenPosition(BaseModel):
    currency: str
    symbol: str
    description: Optional[str] = None
    position: float
    markPrice: float
    positionValue: float
    costBasisPrice: float
    costBasisMoney: float
    percentOfNAV: float
    fxRateToBase: float


class Trade(BaseModel):
    date: date
    quantity: float
    tradePrice: float
    ibCommission: float
    buySell: str
    netCash: float
    symbol: str


class CashTransaction(BaseModel):
    date: date
    amount: float
    type: str
    fxRateToBase: float


class TimeWeightedReturnItem(BaseModel):
    date: str
    twr: float


class TimeWeightedReturn(BaseModel):
    total: float
    series: List[TimeWeightedReturnItem]


class FinancialReport(BaseModel):
    reports: int
    fromDate: date
    toDate: date
    account: AccountInfo
    cashReport: CashReport
    valueOverTime: List[ValueOverTimePoint]
    statementFunds: List[StatementFund]
    openPositions: List[OpenPosition]
    trades: List[Trade]
    cashTransactions: List[CashTransaction]
    timeWeightedReturn: TimeWeightedReturn


class MonteCarloRequest(BaseModel):
    start_value: float
    twr_series: List[dict]
    monthly_deposit: float = 200
    monthly_withdrawal: float = 0
    days_ahead: int = 100
    sims: int = 5000
    target_value: float | None = None


class PortfolioProjectionPoint(BaseModel):
    date: date
    p5: float
    p25: float
    p50: float
    p75: float
    p95: float
    baseline: float


class GoalAchievement(BaseModel):
    targetValue: float
    successProbability: Optional[float] = None


class MonteCarloResult(BaseModel):
    portfolioProjection: List[PortfolioProjectionPoint]
    goalAchievement: Optional[GoalAchievement] = None


class MonteCarloResult(BaseModel):
    portfolioProjection: List[PortfolioProjectionPoint]
    goalAchievement: Optional[GoalAchievement] = None


class MonteCarloResponse(BaseModel):
    job_id: UUID
    status: Literal["running", "finished"]
    result: Optional[MonteCarloResult] = None
