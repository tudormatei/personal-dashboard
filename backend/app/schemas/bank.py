from pydantic import BaseModel
from typing import Optional, List, Dict


class UploadResponse(BaseModel):
    imported: int


class Transaction(BaseModel):
    id: int
    date: str
    description: str
    amount: float
    balance: Optional[float] = None
    type: Optional[str] = None
    source_bank: str


class Summary(BaseModel):
    total_in: float
    total_out: float
    net_balance: float
    by_bank: Dict[str, float]


class Meta(BaseModel):
    count: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    bank: Optional[str] = None


class TransactionsResponse(BaseModel):
    transactions: List[Transaction]
    summary: Summary
    meta: Meta
