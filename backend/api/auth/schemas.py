from ninja import Schema
from pydantic import EmailStr, Field

class SignUpSchema(Schema):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class LoginSchema(Schema):
    username: str
    password: str

class TokenSchema(Schema):
    access_token: str
    token_type: str = "bearer"

class UserSchema(Schema):
    id: int
    username: str
    email: EmailStr
