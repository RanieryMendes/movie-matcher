import csv
from django.core.management.base import BaseCommand
from api.models import Movie
from datetime import datetime

class Command(BaseCommand):
    help = 'Populates and updates the Movie table with data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']

        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # Parse date
                release_date = None
                if row['release_date']:
                    try:
                        release_date = datetime.strptime(row['release_date'], '%Y-%m-%d').date()
                    except ValueError:
                        self.stdout.write(self.style.WARNING(f"Invalid release date format for TMDB ID {row['id']}"))

                # Parse boolean
                adult = row['adult'].lower() == 'true'

                # Parse numeric fields
                vote_average = float(row['vote_average']) if row['vote_average'] else None
                vote_count = int(row['vote_count']) if row['vote_count'] else None
                revenue = int(row['revenue']) if row['revenue'] else None
                runtime = int(row['runtime']) if row['runtime'] else None
                budget = int(row['budget']) if row['budget'] else None
                popularity = float(row['popularity']) if row['popularity'] else None

                movie_data = {
                    'title': row['title'],
                    'vote_average': vote_average,
                    'vote_count': vote_count,
                    'status': row['status'],
                    'release_date': release_date,
                    'revenue': revenue,
                    'runtime': runtime,
                    'adult': adult,
                    'backdrop_path': row['backdrop_path'],
                    'budget': budget,
                    'homepage': row['homepage'],
                    'imdb_id': row['imdb_id'],
                    'original_language': row['original_language'],
                    'original_title': row['original_title'],
                    'overview': row['overview'],
                    'popularity': popularity,
                    'poster_path': row['poster_path'],
                    'tagline': row['tagline'],
                    'genres': row['genres'],
                    'production_companies': row['production_companies'],
                    'production_countries': row['production_countries'],
                    'spoken_languages': row['spoken_languages'],
                    'keywords': row['keywords']
                }
                print(movie_data)
                try:
                    movie, created = Movie.objects.update_or_create(
                        tmdb_id=int(row['id']),
                        defaults=movie_data
                    )
                except any as e:
                    print(f"Invalid {e}")
                    print(movie_data)

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Successfully added movie: {row['title']}"))
                else:
                    self.stdout.write(self.style.SUCCESS(f"Successfully updated movie: {row['title']}"))

        self.stdout.write(self.style.SUCCESS('Finished populating and updating movies from CSV'))