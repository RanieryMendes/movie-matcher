from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer
from ninja.orm import create_schema
from typing import List
from django.shortcuts import get_object_or_404
from .models import Movie, StreamingPlatform, StreamingAvailability, MovieIDMapping
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from .auth.routes import auth_router
from ninja import NinjaAPI, Schema
from ninja.orm import create_schema
from typing import List
from django.shortcuts import get_object_or_404
from .models import Movie, StreamingPlatform, StreamingAvailability, MovieIDMapping
from .auth.security import AuthBearer  # Import from the new security module
from .auth.routes import auth_router
from .movies.routes import router
from .profile.routes import profile_router

api = NinjaAPI()
api.add_router("/auth", auth_router)
api.add_router("/movies", router)
api.add_router("/profile", profile_router)
# JWT Authentication

# Schemas
MovieSchema = create_schema(Movie)
StreamingPlatformSchema = create_schema(StreamingPlatform)
StreamingAvailabilitySchema = create_schema(StreamingAvailability)
MovieIDMappingSchema = create_schema(MovieIDMapping)

class MovieIn(Schema):
    title: str
    tmdb_id: int
    # Add other fields as needed, excluding auto-generated fields

# # Movie endpoints
# @api.get("/movies", response=List[MovieSchema], auth=AuthBearer())
# def list_movies(request):
#     return Movie.objects.all()

# @api.get("/movies/{movie_id}", response=MovieSchema) #auth=AuthBearer())
# def get_movie(request, movie_id: int):
#     movie = Movie.objects.get(tmdb_id=movie_id)
#     print("Hello")
#     print(movie)
#     return get_object_or_404(Movie, tmdb_id=movie_id)

# @api.post("/movies", response=MovieSchema, auth=AuthBearer())
# def create_movie(request, movie: MovieIn):
#     return Movie.objects.create(**movie.dict())

# @api.put("/movies/{movie_id}", response=MovieSchema)#, auth=AuthBearer())
# def update_movie(request, movie_id: int, data: MovieIn):
#     movie = get_object_or_404(Movie, id=movie_id)
#     for attr, value in data.dict().items():
#         setattr(movie, attr, value)
#     movie.save()
#     return movie

# @api.delete("/movies/{movie_id}", auth=AuthBearer())
# def delete_movie(request, movie_id: int):
#     movie = get_object_or_404(Movie, id=movie_id)
#     movie.delete()
#     return {"success": True}

# Implement similar endpoints for StreamingPlatform, StreamingAvailability, and MovieIDMapping

# Authentication endpoints
class TokenSchema(Schema):
    access_token: str

class LoginSchema(Schema):
    username: str
    password: str

@api.post("/token", response=TokenSchema)
def login(request, data: LoginSchema):
    user = authenticate(username=data.username, password=data.password)
    if user is None:
        return api.create_response(request, {"detail": "Invalid credentials"}, status=401)
    
    token = jwt.encode({"user_id": user.id}, settings.SECRET_KEY, algorithm="HS256")
    return {"access_token": token}
