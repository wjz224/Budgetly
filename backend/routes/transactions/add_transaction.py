from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from firebase_admin import auth

from models.Transaction import Transaction
from models.Budget import Budget
from models.BudgetCategory import BudgetCategory
from models.Category import Category
from datetime import datetime

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os
load_dotenv(find_dotenv())

router = APIRouter()

@router.post("/transactions/{budget_id}")
async def add_transactions_for_budget(budget_id: int, request: Request):
    """
    Retrieves all transactions for a given budget, ensuring the user has access.
    """
    headers = request.headers
    accessToken = headers.get("authorization")
    # Check if user has access token
    if not accessToken:
        raise HTTPException(status_code=401, detail="No authorization header")
    try:
        # Check if user has permission to access the budget
        user = auth.verify_id_token(accessToken)
        user_id = user.get("uid")
       
        # Retrieve all budgets for the given user_id from the database
        budgets = Budget.get_budgets_by_user_id(user_id)
        budget_ids = {b.BudgetID for b in budgets}
        if budget_id not in budget_ids:
            raise HTTPException(status_code=403, detail="User does not have access to this budget")
        # Retrieve user input
        data = await request.json()

        transaction_name = data.get("transaction_name")
        transaction_amount = data.get("amount")
        transaction_date = data.get("date")
        transaction_description = data.get("description")
        datetime.fromisoformat(transaction_date)
   
        # Retrieve all categories for the given budget_id from the database
        budget_categories = BudgetCategory.get_category_ids_by_budget_id(budget_id)
        category_ids = {bc.CategoryID for bc in budget_categories}
        print(category_ids)
        # Get category names for these category_ids
        categories = []
        for category_id in category_ids:
            category = Category.get_category_by_id(category_id)
            if category:
                categories.append(category.Name)
        
        # Initialize OpenAI client
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # Send a prompt to the cheapest model (GPT-3.5-Turbo)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"What category should {transaction_name} be in? Categories : {categories} (Only choose from this list of categories. If there are no categories that fit the transaction name, then generate a new one)"}],
            max_tokens=50  # Reduce response length to save tokens
        )
        print(f"Categories: {response.choices[0].message.content}")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while adding the transaction : {str(e)}"
        )