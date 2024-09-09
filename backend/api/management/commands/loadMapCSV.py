import csv
from django.core.management.base import BaseCommand, CommandParser
from api.models import MovieIDMapping
from django.db import transaction
from django.db.utils import IntegrityError

class Command(BaseCommand):
    help = 'Imports Movie ID Mappings from a CSV file into the database'

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument('csvfile', type=str, help='Path to the CSV file')
        parser.add_argument('--start-line', type=int, default=1, help='Line number to start reading from (default: 1)')

    def handle(self, *args, **options):
        start_line = options['start_line']
        with open(options["csvfile"], newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            with transaction.atomic():
                for i, row in enumerate(reader, start=1):
                    if i < start_line:
                        continue

                    # Check for null values
                    if any(value == "null" for value in row.values()):
                        self.stdout.write(f"Skipping row {i} due to null value(s)")
                        continue

                    try:
                        imdb_id = row[' IMDB ID'].strip()  # Remove leading/trailing spaces
                        
                        # Use imdb_id as the unique identifier in update_or_create
                        MovieIDMapping.objects.update_or_create(
                            imdb_id=imdb_id,  # Check for duplicates based on imdb_id
                            defaults={
                                'watchmode_id': row['Watchmode ID'].strip(),
                                'tmdb_id': row[' TMDB ID'].strip(),
                                'tmdb_type': row[' TMDB Type'].strip(),
                                'title': row[' Title'].strip(),
                                # 'year': row[' Year'].strip(),
                            }
                        )
                        self.stdout.write(f"Processed: {row[' Title']}, IMDB ID: {imdb_id}")
                    except IntegrityError as e:
                        self.stderr.write(f"IntegrityError: {e} for IMDB ID {imdb_id}")
                        continue 
        self.stdout.write(self.style.SUCCESS('Successfully imported movie ID mappings'))