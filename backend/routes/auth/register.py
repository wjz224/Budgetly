import os
import sys

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_dir)

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from firebase_admin import auth
from models.User import User  
from models.Signup import SignupSchema  

router = APIRouter()

# Registration Route
@router.post("/register")
async def user_signup(user: SignupSchema):
    # Extract email and password from the request body
    # The request body should be in JSON format:
    # {
    #   email: "", (String)
    #   password: "" (String)
    # }
    email = user.email
    password = user.password
    
    try:
        # Check if the user already exists in our database with that email.
        # If they do then don't allow to make another account.
        existing_user = User.get_user_by_email(email)
        if existing_user:
            # Return status code 400 and tell the user that the account already exists.
            raise HTTPException(
                status_code=400,
                detail=f"Account already exists for the email {email}",
            )
        # If the user does not exist, then create a new user in Firebase using the email and password.
        user = auth.create_user(email=email, password=password)
        # Insert the user into our database with the uid returned from Firebase and their provided email.
        User.insert_user(user.uid, email)
        # Return a status code 200 as well success message
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "User created successfully",
            },
        )
    except auth.EmailAlreadyExistsError:
        # If the email already exists in firebase for some reason, then return an error saying the account already exists.
        raise HTTPException(
            status_code=400,
            detail=f"Account already created for the email {email}",
        )