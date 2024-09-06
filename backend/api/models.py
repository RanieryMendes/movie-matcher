from django.db import models

# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    tmdb_id = models.IntegerField(unique=True)
    imdb_rating = models.FloatField(null=True, blank=True)
    rotten_tomatoes_rating = models.FloatField(null=True, blank=True)

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