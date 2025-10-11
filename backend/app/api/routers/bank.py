from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, status

from ...services.bank import process_bank_files

from ...schemas.bank import UploadResponse


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
