import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from ninja.security import HttpBearer
from jwt import ExpiredSignatureError, InvalidTokenError

class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = get_user_model().objects.get(id=payload["user_id"])
            return user
        except (ExpiredSignatureError, InvalidTokenError, jwt.PyJWTError, get_user_model().DoesNotExist):
            return None
