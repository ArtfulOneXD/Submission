from ninja import Router
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError
from .schemas import *

router = Router()
User = get_user_model()

@router.post("/signup", response=UserCreatedResponse)
def signup(request, data: UserCreateSchema):
    if User.objects.filter(username=data.username).exists():  
        raise HttpError(400, "Username already exists")
    if User.objects.filter(email=data.email).exists():
        raise HttpError(400, "Email already exists")

    User.objects.create(
        username=data.username,
        email=data.email,
        first_name=data.first_name,
        last_name=data.last_name,
        phone_number=data.phone_number,
        password=make_password(data.password),
    )

    return {"message": "User created successfully"}


@router.get("/me", response=UserSchema, auth=JWTAuth())
def get_current_user(request):
    return request.user