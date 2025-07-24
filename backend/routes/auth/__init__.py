from .login import router as login_router
from .register import router as register_router
from .refresh_token import router as refresh_token_router
from .google_signup import router as google_signup_router
from .valid_user import router as valid_user_router
from .logout import router as logout_router

routers = [
    login_router,
    register_router,
    refresh_token_router,
    google_signup_router,
    valid_user_router,
    logout_router,
]
