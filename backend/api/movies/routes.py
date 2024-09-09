from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from ..models import Movie
from .schemas import MovieSchema, MovieIn
from ..auth.security import AuthBearer
from django.forms.models import model_to_dict

router = Router()

@router.get("/popular",response=List[MovieSchema])
def get_popular_movies(request):
    print("In popular request")
    popular_movies = Movie.objects.order_by('-popularity')[:10]
    print(popular_movies)
    movie_list = [model_to_dict(movie) for movie in popular_movies]
    return movie_list

@router.get("/", response=List[MovieSchema], auth=AuthBearer())
def list_movies(request):
    return Movie.objects.all()

@router.get("/{tmdb_id}", response=MovieSchema)
def get_movie(request, tmdb_id: int):
    return get_object_or_404(Movie, tmdb_id=tmdb_id)

@router.post("/", response=MovieSchema, auth=AuthBearer())
def create_movie(request, movie: MovieIn):
    return Movie.objects.create(**movie.dict())

@router.put("/{tmdb_id}", response=MovieSchema, auth=AuthBearer())
def update_movie(request, tmdb_id: int, data: MovieIn):
    movie = get_object_or_404(Movie, tmdb_id=tmdb_id)
    for attr, value in data.dict().items():
        setattr(movie, attr, value)
    movie.save()
    return movie

@router.delete("/{tmdb_id}", auth=AuthBearer())
def delete_movie(request, tmdb_id: int):
    movie = get_object_or_404(Movie, tmdb_id=tmdb_id)
    movie.delete()
    return {"success": True}

