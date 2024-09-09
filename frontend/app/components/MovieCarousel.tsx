import React from 'react';
import  Carousel  from 'react-material-ui-carousel';
import { Paper, Button, Typography, Box } from '@mui/material';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieCarouselProps {
  movies: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  console.log("AA", movies)
  return (
   
    <Carousel>
      {movies.map((movie) => (
        <Paper key={movie.id}>
          <Box
            sx={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 2,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {movie.title}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              View Details
            </Button>
          </Box>
        </Paper>
      ))}
    </Carousel>
  );
};

export default MovieCarousel;