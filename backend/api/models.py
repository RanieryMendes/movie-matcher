from django.db import models

# Create your models here.
from django.db import models

class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True, verbose_name="TMDb ID")
    title = models.CharField(max_length=500)
    vote_average = models.FloatField(null=True, blank=True)
    vote_count = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    revenue = models.BigIntegerField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    adult = models.BooleanField(default=False)
    backdrop_path = models.CharField(max_length=500, null=True, blank=True)
    budget = models.BigIntegerField(null=True, blank=True)
    homepage = models.URLField(null=True, blank=True, max_length=500)
    imdb_id = models.CharField(max_length=20, null=True, blank=True)
    original_language = models.CharField(max_length=10, null=True, blank=True)
    original_title = models.CharField(max_length=500, null=True, blank=True)
    overview = models.TextField(null=True, blank=True)
    popularity = models.FloatField(null=True, blank=True)
    poster_path = models.CharField(max_length=500, null=True, blank=True)
    tagline = models.TextField(null=True, blank=True)
    genres = models.TextField(null=True, blank=True)
    production_companies = models.TextField(null=True, blank=True)
    production_countries = models.TextField(null=True, blank=True)
    spoken_languages = models.TextField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title

class StreamingPlatform(models.Model):
    name = models.CharField(max_length=255)

class StreamingAvailability(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='streaming_availability')
    platform = models.ForeignKey(StreamingPlatform, on_delete=models.CASCADE)
    web_url = models.URLField(null=True, blank=True)
    region = models.CharField(max_length=10, null=True, blank=True)  # Add region field to track availability by region

    class Meta:
        unique_together = ('movie', 'platform', 'region')

class MovieIDMapping(models.Model):
    watchmode_id = models.IntegerField(unique=True, verbose_name="Watchmode ID")
    imdb_id = models.CharField(max_length=15, unique=True, verbose_name="IMDb ID")
    tmdb_id = models.IntegerField(unique=True, verbose_name="TMDb ID")
    tmdb_type = models.CharField(max_length=10, choices=[('movie', 'Movie'), ('show', 'Show')], verbose_name="TMDb Type")
    title = models.CharField(max_length=255, verbose_name="Title")


    class Meta:
        verbose_name = "Movie ID Mapping"
        verbose_name_plural = "Movie ID Mappings"
        indexes = [
            models.Index(fields=['watchmode_id']),
            models.Index(fields=['imdb_id']),
            models.Index(fields=['tmdb_id']),
        ]

    def __str__(self):
        return f"{self.title} ({self.imdb_id})"