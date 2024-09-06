import os
import requests
from api.models import Movie, MovieIDMapping, StreamingPlatform, StreamingAvailability
from django.core.management.base import BaseCommand

WATCHMODE_URL = "https://api.watchmode.com/v1/title/{watchmode_id}/sources/?apiKey={api_key}"

class Command(BaseCommand):
    help = 'Fetches streaming availability from Watchmode and updates the database'

    def handle(self, *args, **kwargs):
        api_key = os.environ.get('WATCHMODE_API_KEY')
        movies = Movie.objects.all()

        i = 0
        for movie in movies:
            # print("Movie TMDB ID: ", movie.tmdb_id)
            
            # Get the watchmode_id from the MovieIDMapping table using the movie's tmdb_id
            try:
                movie_mapping = MovieIDMapping.objects.get(tmdb_id=movie.tmdb_id)
                watchmode_id = movie_mapping.watchmode_id
                print(f"Found Watchmode ID {watchmode_id} for TMDB ID {movie.tmdb_id}")


                # Replace tmdb_id with watchmode_id for the API call
                url = WATCHMODE_URL.format(watchmode_id=watchmode_id, api_key=api_key)
                response = requests.get(url).json()
                i += 1
                
                # print("Response: ", response)

                # Parse response and save streaming platforms
                for source in response:
                    # print("source", source)
                    # print(f"Movie: {source['name']}, region: {source['region']}")
                    platform, created = StreamingPlatform.objects.get_or_create(name=source['name'])
                    print(platform)
                    StreamingAvailability.objects.update_or_create(
                        movie=movie,
                        platform=platform,
                        region = source['region'],
                        defaults={'web_url': source['web_url'], 'region': source['region']}
                    )
                    print(f"Movie: {movie.title}, Platform: {platform.name}, Region: {source['region']}, Web URL: {source['web_url']}")

                if i == 950:  # Break after 2 movies bcs api limit
                    print("Breaking after 950 movies")
                    break
            except MovieIDMapping.DoesNotExist:
                print(f"Watchmode ID not found for TMDB ID {movie.tmdb_id}")
                continue


        self.stdout.write(self.style.SUCCESS('Successfully updated streaming availability'))
