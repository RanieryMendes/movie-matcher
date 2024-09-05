from django.test import TestCase
from api.models import Movie

class MovieTestCase(TestCase):
    def setUp(self):
        Movie.objects.create(title="Inception", tmdb_id=12345)
        
    def test_movie_creation(self):
        """Movies are correctly created"""
        movie = Movie.objects.get(tmdb_id=12345)
        self.assertEqual(movie.title, "Inception")