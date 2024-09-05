from django.test import TestCase
from django.core.management import call_command
from api.models import Movie
import requests_mock
from datetime import datetime

class TMDbIntegrationTest(TestCase):

    @requests_mock.Mocker()
    def test_tmdb_integration(self, mock):
        # Mock the popular movies endpoint
        mock.get('https://api.themoviedb.org/3/movie/popular', 
                 json={"results": [{"id": 533535, "title": "Deadpool & Wolverine", "overview": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine."}]})
        
        # Mock the movie details endpoint for the movie with id 533535
        mock.get('https://api.themoviedb.org/3/movie/533535', 
                 json={"id": 533535, "title": "Deadpool & Wolverine", "release_date": "2024-01-01", "overview": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine."})

        # Call the management command to fetch data from TMDb
        call_command('getTmdb')
        
        # Validate that the movie was saved to the database
        movie = Movie.objects.get(tmdb_id=533535)
        self.assertEqual(movie.title, "Deadpool & Wolverine")
        self.assertEqual(movie.description, "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.")
          # Convert string "2024-01-01" to a datetime.date object
        expected_date = datetime.strptime("2024-01-01", "%Y-%m-%d").date()
        self.assertEqual(movie.release_date, expected_date)