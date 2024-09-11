'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import MovieCarousel from './../components/MovieCarousel';

import dynamic from 'next/dynamic';
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  tmdb_id: number;
}
const Sidebar = dynamic(() => import('./../components/sideBar'), { ssr: false });

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/movies/popular');
        const data = await response.json();
        setPopularMovies(data);
      
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div>
   
    <Box sx={{ display: 'flex' }}>
    {typeof window !== 'undefined' && <Sidebar />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Movie Matcher
        </Typography>
        <Typography variant="h6" gutterBottom>
          Top 10 Popular Movies
        </Typography>
        <MovieCarousel movies={popularMovies} />
      </Container>
    </Box>
    </div>
  );
}