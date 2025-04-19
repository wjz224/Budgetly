from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from route_utilities.initialize_firebase import firebase
import json

router = APIRouter()

@router.post("/refresh_token")
async def refresh_token(request: Request):
    try:
        # Retrieve refresh token from HttpOnly cookie
        refresh_token = request.cookies.get("refreshToken")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Missing refresh token")

        # Use Pyrebase to refresh the token
        user = firebase.auth().refresh(refresh_token)
        new_access_token = user["idToken"]

        return JSONResponse(
            status_code=200,
            content={
                "accessToken": new_access_token,
            },
        )

    except Exception as e:
        try:
            error_json_str = e.args[1]
            error_data = json.loads(error_json_str)
            message = error_data["error"]["message"]
        except:
            message = str(e)

        raise HTTPException(
            status_code=401,
            detail=f"Token refresh failed: {message}",
        )
