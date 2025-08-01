from fastapi import APIRouter, HTTPException, Request
from firebase_admin import auth
from models.Budget import Budget
from datetime import datetime

router = APIRouter()

@router.post("/budgets")
async def add_budget(request: Request):
    token = request.headers.get("authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Missing authorization token")

    try:
        user = auth.verify_id_token(token)
        user_id = user.get("uid")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid Firebase token")

        data = await request.json()

        name = data.get("name")
        amount = data.get("amount")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        description = data.get("description")
        currency = data.get("currency")

        if not all([name, amount, start_date, end_date, description, currency]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        # Convert date strings to datetime objects
        start_date = datetime.fromisoformat(start_date)
        end_date = datetime.fromisoformat(end_date)

        Budget.insert_budget(
            user_id=user_id,
            name=name,
            amount=amount,
            start_date=start_date,
            end_date=end_date,
            description=description,
            currency=currency
        )

        return {"message": "Budget created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create budget: {str(e)}")
