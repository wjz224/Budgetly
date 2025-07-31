from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/logout")
async def logout():
    response = JSONResponse(
        status_code=200,
        content={"status": "success", "message": "Logged out successfully"},
    )
    response.set_cookie(
        key="refreshToken",
        value="",
        httponly=True,
        secure=True,  # Set to True if using HTTPS
        samesite="None",  # Adjust according to your needs
        path="/",
        max_age=0,  # Expire immediately
    )
    return response 