from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from firebase_admin import auth

from models.Transaction import Transaction
from models.Budget import Budget

router = APIRouter()

@router.get("/transactions/{budget_id}")
async def get_transactions_for_budget(budget_id: int, request: Request):
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

        # Retrieve all budgets for the given user_id from the database
        budgets = Budget.get_budgets_by_user_id(user_id)
        budget_ids = {b.BudgetID for b in budgets}

        # Check if the requested budget_id belongs to the user
        if budget_id not in budget_ids:
            raise HTTPException(status_code=403, detail="User does not have access to this budget")

        # Retrieve all transactions for the given budget_id
        transactions = Transaction.get_transactions_by_budget_id(budget_id)

        # Format the transactions into a list of dictionaries for the JSON response
        transactions_list = [
            {
                "TransactionID": txn.TransactionID,
                "TransactionName": txn.TransactionName,
                "BudgetID": txn.BudgetID,
                "Amount": txn.Amount,
                "CategoryID": txn.CategoryID,
                "Description": txn.Description,
                "Date": txn.Date.isoformat(),
                "CreatedAt": txn.CreatedAt.isoformat()
            }
            for txn in transactions
        ]

        return JSONResponse(status_code=200, content={"transactions": transactions_list})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while retrieving transactions"
        )