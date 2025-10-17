from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, status

from ...utils.validation import validate_iso_date
from ...services.bank import (
    get_bank_transactions,
    get_distinct_banks,
    get_full_summary,
    get_transaction_categories,
    process_bank_files,
)
from ...schemas.bank import (
    BanksResponse,
    CategoriesResponse,
    SummaryResponse,
    TransactionsResponse,
    UploadResponse,
)


router = APIRouter(prefix="/bank")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_bank(files: List[UploadFile] = File(...)) -> UploadResponse:
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files uploaded",
        )

    results = []
    for file in files:
        contents = await file.read()
        if not contents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File '{file.filename}' is empty",
            )

        results.append(
            {
                "filename": file.filename,
                "contents": contents,
                "size": len(contents),
            }
        )

    return await process_bank_files(results)


@router.get("/transactions")
def get_transactions(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    bank: Optional[str] = None,
    description: Optional[str] = None,
    order: Optional[str] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
) -> TransactionsResponse | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")

    return get_bank_transactions(
        start_date=start_date,
        end_date=end_date,
        bank=bank,
        description=description,
        order=order,
        category=category,
        subcategory=subcategory,
        page=page,
        page_size=page_size,
    )


@router.get("/categories")
def get_categories() -> CategoriesResponse:
    return get_transaction_categories()


@router.get("/")
def get_available() -> BanksResponse:
    return get_distinct_banks()


@router.get("/summary")
def summary(aggregate_days: Optional[int] = None) -> SummaryResponse | None:
    return get_full_summary(aggregate_days)
