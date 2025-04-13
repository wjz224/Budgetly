from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth.google_signup import router as google_signup_router
from routes.auth.register import router as register_router
from routes.auth.login import router as login_router
from routes.auth.valid_user import router as valid_user_router
from route_utilities.initialize_firebase import initialize_firebase

# Initialize Firebase
initialize_firebase()

app = FastAPI(
    description="Budget Tracker API",
    title="FireBase Authentication",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", reload=True)