from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from firebase_admin import auth

from models.Budget import Budget


router = APIRouter()

@router.get("/budgets")
async def get_all_budgets(request: Request):
    """
    Retrieves all budgets associated with the currently authenticated user.
    """
    # # Extract the JWT/Session token from the request headers
    headers = request.headers
    # The JWT/Session token is passed in the headers as "authorization"
    accessToken = headers.get("authorization")
    if not accessToken:
        raise HTTPException(status_code=401, detail="No authorization header")
    try:
        user = auth.verify_id_token(accessToken)
        user_id = user.get("uid")

        # Retrieve all budgets for the given user_id from the database
        budgets = Budget.get_budgets_by_user_id(user_id)

        # Format the budgets into a list of dictionaries for the JSON response
        budgets_list = [
            {
                "BudgetID": budget.BudgetID,
                "BudgetName": budget.BudgetName,
                "BudgetAmount": budget.BudgetAmount,
                "BudgetStartDate": budget.BudgetStartDate.isoformat(),
                "BudgetEndDate": budget.BudgetEndDate.isoformat(),
                "BudgetDescription": budget.BudgetDescription,
                "Currency": budget.Currency,
                "CreatedAt": budget.CreatedAt.isoformat()
            }
            for budget in budgets
        ]

        return JSONResponse(status_code=200, content={"budgets": budgets_list})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while retrieving budgets: {str(e)}"
        )