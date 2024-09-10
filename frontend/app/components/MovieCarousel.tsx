import React from 'react';
import  Carousel  from 'react-material-ui-carousel';
import { Paper, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  tmdb_id: number;
}

interface MovieCarouselProps {
  movies: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  console.log(movies);
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
            <Link href={`/movie/${movie.tmdb_id}`}>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                View Details
              </Button>
            </Link>
          </Box>
        </Paper>
      ))}
    </Carousel>
  );
};

export default MovieCarousel;



//write a function that when the user clicks on the button
// saying view details it should take the user to the details page of the movie
