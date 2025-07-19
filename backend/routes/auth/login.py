import os
import sys

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_dir)

from fastapi import APIRouter, HTTPException, Response
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
        accessToken = user["idToken"]
        refresh_token = user["refreshToken"]
        
        # Return a JSON response with the token and a success message.
        response = JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "User signed in successfully",
                "accessToken": accessToken,
            },
        )
        
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=True,  # Set to True if using HTTPS
            samesite="None",  # Adjust according to your needs
            path="/",  # Make the cookie available to all routes
            # domain= os.getenv('Client_URL'),  # Adjust for your domain
            max_age=7 * 24 * 60 * 60,  # Cookie valid for 7 days
        )
        
        return response
    except Exception as e:
        # If there is an error with the user's login, return a JSON response with the error message.
        error_json_str = e.args[1]
        # Then load it as a JSON
        error_data = json.loads(error_json_str)
        # Then extract the message and return it as a JSON response.
        message = error_data["error"]["message"]
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": message.replace("_", " "),
            },
        )