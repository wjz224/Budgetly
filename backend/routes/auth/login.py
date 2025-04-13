import os
import sys

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_dir)

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.Signup import LoginSchema  
# Import the firebase object to access our pyrebase firebase object
from route_utilities.initialize_firebase import firebase  
import json

router = APIRouter()
# Login Route
@router.post("/login")
async def login_token(user: LoginSchema):
    # Extract email and password from the request body 
    # The request body should be in JSON format:
    #{
    #  email: "", (String)
    #  password: "" (String)
    #} 
    email = user.email
    password = user.password
    try:
        # Try to authenticate the email and password in Firebase using pyrebase's firebase object.
        user = firebase.auth().sign_in_with_email_and_password(email=email, password=password)
        # If it succeeds, it will return a user object containing the user's information.
        # Extract the idToken which is the JWT/sessionToken for the users session 
        token = user["idToken"]
        # Return a JSON response with the token and a success message.
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "User signed in successfully",
                "token": token,
            },
        )
    except Exception as e:
        # If there is an error with the users login, return the message by parsing the error message from Firebase.
        # Since the except is a HTTPException, grab the first argument which is the error message in JSON
        error_json_str = e.args[1]
        # Then load it as a JSON
        error_data = json.loads(error_json_str)
        # Then extract the message and return it as an HTTPException with a 400 status code.
        message = error_data["error"]["message"]
        raise HTTPException(
            status_code=400,
            detail=message.replace("_", " "),
        )