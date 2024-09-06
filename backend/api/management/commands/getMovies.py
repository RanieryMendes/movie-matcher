import requests
from django.core.management.base import BaseCommand
from api.models import Movie, MovieIDMapping
import os
from datetime import datetime

API_KEY = os.environ.get('TMDB_API_KEY')
# movie_id="tt1375666"
class Command(BaseCommand):
    help = 'Fetches movies from TMDb and updates the database'

    def handle(self, *args, **kwargs):
        
        movie_id_mappings = MovieIDMapping.objects.all()

        for movie_mapped in movie_id_mappings:
            print(movie_mapped.tmdb_id)
            url = f'https://api.themoviedb.org/3/movie/{movie_mapped.tmdb_id}?api_key={API_KEY}'
            response = requests.get(url)
    
            if response.status_code == 200:
                data = response.json()
                release_date = data['release_date']
                try:
                    if release_date:
                        release_date = datetime.strptime(release_date, '%Y-%m-%d').date()
                    else:
                        release_date = None
                except ValueError:
                    release_date = None
                    print(f"Invalid release date format for TMDB ID {movie_mapped.tmdb_id}")

  
                Movie.objects.update_or_create(
                    tmdb_id=data['id'],
                    defaults={
                        'title': data['title'],
                        'description': data['overview'],
                        'release_date': release_date
            }
        )
                        
            else:
                print(f"Failed to fetch popular movies: {response.status_code}, movie id: {movie_mapped.tmdb_id}, movie title: {movie_mapped.title}")
                self.stdout.write(self.style.SUCCESS('Successfully updated movies from TMDb'))

