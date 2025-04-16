from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from firebase_admin import auth

router = APIRouter()

# Valid_user route that validates whether or not a user is logged in or not.
@router.get("/valid_user")
async def validate_token(request: Request):
    # # print(request.cookies)
    # # Extract the JWT/Session token from the request headers
    headers = request.headers
    # # The refresh token is passed in the cookies as "refreshToken"
    refreshToken = request.cookies.get("refreshToken")
    # # The JWT/Session token is passed in the headers as "authorization"
    accessToken = headers.get("authorization")

    try:
        user = auth.verify_id_token(accessToken)
   
        # If it is valid, return status code 200 and a success message.
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Token is valid",
            },
        )
    except Exception:
        # If it is not valid, return an exception status code 400 and a message saying the token is invalid.
        raise HTTPException(
            status_code=400,
            detail="Invalid Token",
        )