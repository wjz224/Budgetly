from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv, find_dotenv

import uvicorn
import pyrebase
import json
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Replace "*" with specific origins for better security.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/google-signup")
async def googleSignup(request: Request):  
    try:
        # Get the ID Token from the request body
        body = await request.json()
        id_token = body.get("idToken")

        if not id_token:
            raise HTTPException(status_code=400, detail="ID Token is missing")
        # Verify the ID token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]  
        email = decoded_token["email"]

        # Check if the user already exists in the database
        existing_user = User.get_user_by_email(email)
        if existing_user is None:
            # If the user does not exist, create a new user in the database.
            User.insert_user(uid, email)
        
        return JSONResponse(
            status_code = 200,
            content = {
                "status": "success",
                "message": "User signed in successfully",
                "token": id_token
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google Sign in: {str(e)}")
    pass

@app.post("/register")
async def userSignup(user:SignupSchema):
    email = user.email
    password = user.password

    try:
        # Check if the user already exists in the database
        existing_user = User.get_user_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=f"Account already exists for the email {email}"
            )

        user = auth.create_user(
            email = email,
            password = password
        )

        # Add the user to the PostgreSQL database
        User.insert_user(user.uid, email)
        
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

    except Exception as e:
        # Assuming `e` is the HTTPError
        error_json_str = e.args[1]  # The second argument is the JSON string
        error_data = json.loads(error_json_str)
        message = error_data['error']['message']
        raise HTTPException(
            status_code=400,
            detail= message.replace("_", " ")   
        )

@app.post("/ping")
async def validate_token(request:Request):
    headers = request.headers
    jwt = headers.get('authorization')
    try:    
        user = auth.verify_id_token(jwt)
        return JSONResponse(
            status_code = 200,
            content = {
                "status": "success",
                "message": "Token is valid"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code = 400,
            detail = "Invalid Token"
        )



if __name__ == "__main__":
    uvicorn.run("routes:app", reload = True)