import requests
from api.models import Movie, StreamingPlatform, StreamingAvailability
from django.core.management.base import BaseCommand

JUSTWATCH_URL = "https://apis.justwatch.com/content/titles/movie/{tmdb_id}/locale/en_US"

class Command(BaseCommand):
    help = 'Fetches streaming availability from JustWatch and updates the database'

    def handle(self, *args, **kwargs):
        movies = Movie.objects.all()
        for movie in movies:
            response = requests.get(JUSTWATCH_URL.format(tmdb_id=movie.tmdb_id)).json()

            # Example of parsing response and saving streaming platforms
            for offer in response.get('offers', []):
                platform, created = StreamingPlatform.objects.get_or_create(name=offer['provider_name'])
                StreamingAvailability.objects.update_or_create(
                    movie=movie,
                    platform=platform,
                    defaults={'available_since': offer['added']}
                )
        self.stdout.write(self.style.SUCCESS('Successfully updated streaming availability'))
