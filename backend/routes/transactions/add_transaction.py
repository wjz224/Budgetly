from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from firebase_admin import auth

from models.Transaction import Transaction
from models.Budget import Budget
from models.BudgetCategory import BudgetCategory
from models.Category import Category
from datetime import datetime

router = APIRouter()

@router.post("/transactions/{budget_id}")
async def add_transactions_for_budget(budget_id: int, request: Request):
    """
    Retrieves all transactions for a given budget, ensuring the user has access.
    """
    headers = request.headers
    accessToken = headers.get("authorization")
    if not accessToken:
        raise HTTPException(status_code=401, detail="No authorization header")
    try:
        user = auth.verify_id_token(accessToken)
        user_id = user.get("uid")
        data = await request.json()

        transaction_name = data.get("transaction_name")
        transaction_amount = data.get("amount")
        transaction_date = data.get("date")
        transaction_description = data.get("description")
        datetime.fromisoformat(end_date)
     

