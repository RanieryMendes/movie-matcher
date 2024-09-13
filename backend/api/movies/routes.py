from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from ..models import Movie, Genre
from .schemas import MovieSchema, MovieIn, GenreSchema
from ..auth.security import AuthBearer
from django.forms.models import model_to_dict
from ninja.responses import Response
from django.http import JsonResponse
import random

router = Router()

# @router.get("/popular",response=List[MovieSchema])
# def get_popular_movies(request):
#     print("In popular request")
#     popular_movies = Movie.objects.order_by('-popularity')[:10]
#     print(popular_movies)
#     movie_list = [model_to_dict(movie) for movie in popular_movies]
#     return movie_list

@router.get("/popular", response=List[MovieSchema])
def get_popular_movies(request):
    total_movies = Movie.objects.count()
    random_ids = random.sample(range(1, total_movies + 1), 10)
    popular_movies = Movie.objects.filter(id__in=random_ids)
    
    movie_list = []
    for movie in popular_movies:
        genres = [genre.name for genre in movie.genres.all()]
        production_companies = movie.production_companies.split(', ') if movie.production_companies else []
        production_countries = movie.production_countries.split(', ') if movie.production_countries else []
        
        movie_data = {
            "tmdb_id": movie.tmdb_id,
            "title": movie.title,
            "vote_average": movie.vote_average,
            "vote_count": movie.vote_count,
            "status": movie.status,
            "release_date": movie.release_date,
            "revenue": movie.revenue,
            "runtime": movie.runtime,
            "adult": movie.adult,
            "backdrop_path": movie.backdrop_path,
            "budget": movie.budget,
            "homepage": movie.homepage,
            "imdb_id": movie.imdb_id,
            "original_language": movie.original_language,
            "original_title": movie.original_title,
            "overview": movie.overview,
            "popularity": movie.popularity,
            "poster_path": movie.poster_path,
            "tagline": movie.tagline,
            "genres": genres,
            "production_companies": production_companies,
            "production_countries": production_countries,
            "spoken_languages": movie.spoken_languages,
            "keywords": movie.keywords,
        }
        movie_list.append(movie_data)
    
    return movie_list

@router.get("/genres", response=List[GenreSchema], auth=AuthBearer())
def get_genres(request):
    genres = Genre.objects.all().values_list('name', flat=True)
    return JsonResponse({'genres': list(genres)})

@router.get("/", response=List[MovieSchema], auth=AuthBearer())
def list_movies(request):
    return Movie.objects.all()

@router.get("/{tmdb_id}", response=MovieSchema)
def get_movie(request, tmdb_id: int):
    print("In get movie request", tmdb_id)

    movie = get_object_or_404(Movie, tmdb_id=tmdb_id)
    genres = [genre.name for genre in movie.genres.all()]
    
    # Serialize production companies and countries
    production_companies = movie.production_companies.split(', ') if movie.production_companies else []
    production_countries = movie.production_countries.split(', ') if movie.production_countries else []
    
    # Prepare the response data
    response_data = {
        "tmdb_id": movie.tmdb_id,
        "title": movie.title,
        "vote_average": movie.vote_average,
        "vote_count": movie.vote_count,
        "status": movie.status,
        "release_date": movie.release_date,
        "revenue": movie.revenue,
        "runtime": movie.runtime,
        "adult": movie.adult,
        "backdrop_path": movie.backdrop_path,
        "budget": movie.budget,
        "homepage": movie.homepage,
        "imdb_id": movie.imdb_id,
        "original_language": movie.original_language,
        "original_title": movie.original_title,
        "overview": movie.overview,
        "popularity": movie.popularity,
        "poster_path": movie.poster_path,
        "tagline": movie.tagline,
        "genres": genres,
        "production_companies": production_companies,
        "production_countries": production_countries,
        "spoken_languages": movie.spoken_languages,
        "keywords": movie.keywords,
    }
    
    return Response(response_data)

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


