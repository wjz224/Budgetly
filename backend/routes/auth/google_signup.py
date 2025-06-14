import os
import sys

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from firebase_admin import auth
from models.User import User 
from datetime import timedelta

router = APIRouter()
# Google Authentication Route
@router.post("/google-signup")
async def google_signup(request: Request):
    # Try to extract the ID Token from the request body from the Google Authentication Signin
    # The ID Token is returned from the Google Authentication API from Firebase 
    # It is a JWT Token / SessionToken that represents a users' session.
    try:
        # The request body should be in the JSON format:
        #{
        #   idToken: "" (String)
        #}
        body = await request.json()
        id_token = body.get("idToken")
        refresh_token = body.get("refreshToken")

        # If the ID Token is missing
        if not id_token or not refresh_token:
            raise HTTPException(status_code=400, detail="ID Token is missing")
        # Verify the ID Token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token, clock_skew_seconds=60) 
        uid = decoded_token["uid"]
        email = decoded_token["email"]
       
        # Check if the user exists in our users database
        # If it does not exist, then this is a signup.
        existing_user = User.get_user_by_email(email)
        if existing_user is None:
            # Therefore we need to insert the user into our database.
            User.insert_user(uid, email)
 
        # Set the refresh token in an HTTP-only cookie
        response = JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "User signed in successfully",
                "token": id_token,
            },
        )
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=True,  # Use secure cookies in production
            samesite="None",  # Adjust according to your needs
            path="/",  # Make the cookie available to all routes
            domain="127.0.0.1",  # Adjust for your domain
            max_age=30 * 24 * 60 * 60,  # Set cookie expiration (e.g., 30 days)
        )

        return response
    except Exception as e:
        # If there is an error with the google sign in, return status_code 400 and the error message.
        raise HTTPException(status_code=400, detail=f"Invalid Google Sign in: {str(e)}")