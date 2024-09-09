import requests
from django.core.management.base import BaseCommand
from api.models import Movie
import os

API_KEY = os.environ.get('TMDB_API_KEY')

class Command(BaseCommand):
    help = 'Fetches and updates popular movies from TMDb'

    def handle(self, *args, **kwargs):
        url = f'https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=en-US'
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            movies = data['results']
            
            for movie in movies[:10]:
                Movie.objects.update_or_create(
                    tmdb_id=movie['id'],
                    defaults={
                        'title': movie['title'],
                        'overview': movie['overview'],
                        'popularity': movie['popularity'],
                        'poster_path': movie['poster_path'],
                        'release_date': movie['release_date']
                    }
                )
            
            self.stdout.write(self.style.SUCCESS('Successfully updated popular movies'))
        else:
            self.stdout.write(self.style.ERROR(f"Failed to fetch popular movies: {response.status_code}"))