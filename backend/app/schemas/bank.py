from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Dict, Optional, List


class UploadResponse(BaseModel):
    imported: int


class BanksResponse(BaseModel):
    banks: List[str]


class CategoriesResponse(BaseModel):
    categories: Dict[str, List[str]]


# Transaction


class Transaction(BaseModel):
    id: int
    date: datetime
    description: str
    amount: float
    balance: Optional[float] = None
    unified_balance: Optional[float] = None
    type: Optional[str] = None
    source_bank: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None


class TransactionPagination(BaseModel):
    page: int = Field(..., example=1)
    page_size: int = Field(..., example=50)
    total_count: int = Field(..., example=2000)
    total_pages: int = Field(..., example=40)


class TransactionMeta(BaseModel):
    start_date: Optional[date]
    end_date: Optional[date]


class TransactionsResponse(BaseModel):
    transactions: List[Transaction]
    pagination: TransactionPagination
    meta: TransactionMeta


# Summary


class CashFlowPoint(BaseModel):
    date: date
    inflow: float
    outflow: float
    unified_balance: Optional[float] = None


class SummaryTotals(BaseModel):
    total_income: float
    total_spent: float
    net_savings: float


class SummaryResponse(BaseModel):
    summary: SummaryTotals
    chart_data: List[CashFlowPoint]


# Analytics


class CategoryBreakdown(BaseModel):
    category: str
    subcategory: Optional[str] = None
    value: float
    percentage: float


class CategoriesPieResponse(BaseModel):
    categories: List[CategoryBreakdown]
    total_spent: float


class WeeklySpending(BaseModel):
    week_start: str
    amount: float


class CategoryTrend(BaseModel):
    category: str
    amount_current: float
    amount_prev: float
    percent_change: Optional[float]
    weekly_distribution: List[WeeklySpending] = []


class TrendPeriod(BaseModel):
    current: str
    previous: str


class TopCategoriesResponse(BaseModel):
    period: TrendPeriod
    top_categories: List[CategoryTrend]


class RecurringTransactionPoint(BaseModel):
    date: date
    amount: float
    description: str


class RecurringTransaction(BaseModel):
    description: str
    avg_amount: float
    occurrences: List[RecurringTransactionPoint]
    frequency: Optional[str] = None
    category: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class RecurringCategoryGroup(BaseModel):
    category: str
    transactions: List[RecurringTransaction]


class RecurringResponse(BaseModel):
    recurring: List[RecurringCategoryGroup]
