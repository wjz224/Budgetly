from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
import os
from dotenv import load_dotenv, find_dotenv

import uvicorn
import pyrebase

import firebase_admin
from firebase_admin import credentials,auth

from models.User import User
from models.Budget import Budget
from models.Transaction import Transaction  
from models.Category import Category
from models.BudgetCategory import BudgetCategory
from models.Signup import SignupSchema, LoginSchema

load_dotenv(find_dotenv())
firebase_creds = {
    "type": os.getenv("SERVER_ACCOUNT_GOOGLE_TYPE"),
    "project_id": os.getenv("SERVER_ACCOUNT_GOOGLE_PROJECT_ID"),
    "private_key_id": os.getenv("SERVER_ACCOUNT_GOOGLE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("SERVER_ACCOUNT_GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_EMAIL"),
    "client_id": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_ID"),
    "auth_uri": os.getenv("SERVER_ACCOUNT_GOOGLE_AUTH_URI"),
    "token_uri": os.getenv("SERVER_ACCOUNT_GOOGLE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("SERVER_ACCOUNT_GOOGLE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_CERT_URL"),
    "universe_domain": os.getenv("SERVER_ACCOUNT_GOOGLE_UNIVERSE_DOMAIN"),
}

if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_creds)
    firebase_admin.initialize_app(cred)
    
firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
}

firebase = pyrebase.initialize_app(firebaseConfig)

app = FastAPI(
    description = "Budget Tracker API",
    title = "FireBase Authentication",
)
@app.get("/")
async def root():
    return {"message": "Hello World"}
    
@app.post("/register")
async def userSignup(user:SignupSchema):
    email = user.email
    password = user.password

    try:
        user = auth.create_user(
            email = email,
            password = password
        )
        
        return JSONResponse(
            status_code = 200,
            content = {
                "status": "success",
                "message": f"User created successfully",
                "user_id": user.uid
            }
        )
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code = 400,
            detail = f"Account already created for the email {email}"
        )
        

@app.post("/login")
async def login_token(user:LoginSchema):
    email = user.email
    password = user.password
    try:
        user = firebase.auth().sign_in_with_email_and_password(email = email, password = password)

        token = user['idToken']
        
        return JSONResponse(
            status_code = 200,
            content = {
                "status": "success",
                "message": "User signed in successfully",
                "token": token
            }
        )
    except:
        raise HTTPException(
            status_code = 400,
            detail = "Invalid Credentials"
        )

        
@app.post("/ping")
async def validate_token(request:Request):
    headers = request.headers
    jwt = headers.get('authorization')

    user = auth.verify_id_token(jwt)

    return user["user_id"]


if __name__ == "__main__":
    uvicorn.run("routes:app", reload = True)