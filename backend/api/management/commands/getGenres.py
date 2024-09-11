import csv
from django.core.management.base import BaseCommand
from api.models import Movie, Genre

class Command(BaseCommand):
    help = 'Populates the Genre table and associates genres with existing movies'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']

        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                try:
                    movie = Movie.objects.get(tmdb_id=int(row['id']))
                except Movie.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Movie with TMDB ID {row['id']} not found. Skipping."))
                    continue

                # Handle genres
                genres = [genre.strip() for genre in row['genres'].split(',') if genre.strip()]
                for genre_name in genres:
                    genre, created = Genre.objects.get_or_create(name=genre_name)
                    movie.genres.add(genre)
                    # if created:
                    #     self.stdout.write(self.style.SUCCESS(f"Created new genre: {genre_name}"))

                # self.stdout.write(self.style.SUCCESS(f"Associated genres with movie: {movie.title}"))

        self.stdout.write(self.style.SUCCESS('Finished populating genres and associating with movies'))