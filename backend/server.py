import os
from dotenv import load_dotenv, find_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth.google_signup import router as google_signup_router
from routes.auth.register import router as register_router
from routes.auth.login import router as login_router
from routes.auth.valid_user import router as valid_user_router
from routes.auth.refresh_token import router as refresh_token_router
from routes.budgets.get_budgets import router as get_budgets_router

from route_utilities.initialize_firebase import initialize_firebase

# Load Models:
from models.BaseFile import Base
from models.User import User
from models.Budget import Budget
from models.Transaction import Transaction
from models.Category import Category
from models.BudgetCategory import BudgetCategory

# Initialize Firebase
initialize_firebase()

app = FastAPI(
    description="Budget Tracker API",
    title="FireBase Authentication",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('Client_URL')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Authentication Routes
app.include_router(google_signup_router, tags=["Google Signup"])
app.include_router(register_router, tags=["Register"])
app.include_router(login_router,  tags=["Login"])
app.include_router(valid_user_router,  tags=["Validate User"])
app.include_router(refresh_token_router, tags=["Refresh Token"])
app.include_router(get_budgets_router, tags=["Budget"])

@app.get("/")
def read_root():
    return {"message": "Hello from Vercel!"}