import requests
from django.core.management.base import BaseCommand
from api.models import Movie
import os

API_KEY = os.environ.get('TMDB_API_KEY')
# movie_id="tt1375666"
class Command(BaseCommand):
    help = 'Fetches movies from TMDb and updates the database'

    def handle(self, *args, **kwargs):
        url = f'https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=en-US&page=1'
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            movies = data['results']
            
            for movie in movies:
                movie_id = movie['id']
                # Fetch movie details to get the release date
                details_url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US'
                details_response = requests.get(details_url)
                if details_response.status_code == 200:
                    movie_details = details_response.json()
                    release_date = movie_details.get('release_date')
                    print(f"Title: {movie['title']}, Release Date: {release_date}, Movie id: {movie_id}, movie_details: {movie_details}")
                    Movie.objects.update_or_create(
                        tmdb_id=movie['id'],
                        defaults={
                            'title': movie['title'],
                            'description': movie['overview'],
                            'release_date': release_date
                    
                }
            )
                    
        else:
            print(f"Failed to fetch popular movies: {response.status_code}")
            self.stdout.write(self.style.SUCCESS('Successfully updated movies from TMDb'))

