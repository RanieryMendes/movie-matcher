from ninja import Router
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .schemas import SignUpSchema, LoginSchema, TokenSchema, UserSchema
from django.contrib.auth import authenticate
from .security import AuthBearer  # Import from the new security module
from django.conf import settings
import jwt
auth_router = Router()
User = get_user_model()

# Your existing routes (signup, login, etc.)


@auth_router.post("/signup", response={201: UserSchema, 400: dict})
def signup(request, data: SignUpSchema):
    try:
        validate_password(data.password)
    except ValidationError as e:
        return 400, {"detail": e.messages}

    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Username already exists"}

    if User.objects.filter(email=data.email).exists():
        return 400, {"detail": "Email already exists"}

    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password
    )
    return 201, UserSchema.from_orm(user)

@auth_router.post("/login", response={200: TokenSchema, 401: dict})
def login(request, data: LoginSchema):
    print("In login")
    user = authenticate(username=data.username, password=data.password)
    if user is None:
        return 401, {"detail": "Invalid credentials"}
    
    token = jwt.encode({"user_id": user.id}, settings.SECRET_KEY, algorithm="HS256")
    return 200, {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me", response=UserSchema, auth=AuthBearer())
def get_user(request):
    return UserSchema.from_orm(request.auth)
