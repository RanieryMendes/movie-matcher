from ninja import Schema

from typing import Optional, List
from datetime import date

class MovieSchema(Schema):
    tmdb_id: int
    title: str
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    status: Optional[str] = None
    release_date: Optional[date] = None
    revenue: Optional[int] = None
    runtime: Optional[int] = None
    adult: bool = False
    backdrop_path: Optional[str] = None
    budget: Optional[int] = None
    homepage: Optional[str] = None
    imdb_id: Optional[str] = None
    original_language: Optional[str] = None
    original_title: Optional[str] = None
    overview: Optional[str] = None
    popularity: Optional[float] = None
    poster_path: Optional[str] = None
    tagline: Optional[str] = None
    genres: Optional[List[str]] = None
    production_companies: Optional[List[str]] = None
    production_countries: Optional[List[str]] = None
    spoken_languages: Optional[str] = None
    keywords: Optional[str] = None

class MovieIn(Schema):
    title: str
    tmdb_id: int
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    status: Optional[str] = None
    release_date: Optional[date] = None
    revenue: Optional[int] = None
    runtime: Optional[int] = None
    adult: bool = False
    backdrop_path: Optional[str] = None
    budget: Optional[int] = None
    homepage: Optional[str] = None
    imdb_id: Optional[str] = None
    original_language: Optional[str] = None
    original_title: Optional[str] = None
    overview: Optional[str] = None
    popularity: Optional[float] = None
    poster_path: Optional[str] = None
    tagline: Optional[str] = None
    genres: Optional[List[str]] = None
    production_companies: Optional[str] = None
    production_countries: Optional[str] = None
    spoken_languages: Optional[str] = None
    keywords: Optional[str] = None

class GenreSchema(Schema):
    name: str
