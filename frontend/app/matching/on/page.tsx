'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { startMatchingSession, getNextMovie, voteMovie, getMatchingResult } from '../../../lib/api';

export default function MatchingPage() {
  const { ID } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [matchedMovie, setMatchedMovie] = useState(null);

  useEffect(() => {
    if (ID) {
      startSession();
    }
  }, [ID]);

  const startSession = async () => {
    const session = await startMatchingSession(ID);
    setSessionId(session.id);
    fetchNextMovie(session.id);
  };

  const fetchNextMovie = async (sid) => {
    try {
      const movie = await getNextMovie(sid);
      setCurrentMovie(movie);
    } catch (error) {
      // No more movies, get the result
      const result = await getMatchingResult(sid);
      setMatchedMovie(result);
    }
  };

  const handleVote = async (liked) => {
    await voteMovie({
      session_id: sessionId,
      movie_id: currentMovie.tmdb_id,
      liked: liked
    });
    fetchNextMovie(sessionId);
  };

  if (matchedMovie) {
    return (
      <Box>
        <Typography variant="h4">It's a Match!</Typography>
        <Card>
          <CardMedia
            component="img"
            height="400"
            image={`https://image.tmdb.org/t/p/w500${matchedMovie.poster_path}`}
            alt={matchedMovie.title}
          />
          <CardContent>
            <Typography variant="h5">{matchedMovie.title}</Typography>
            <Typography variant="body2">{matchedMovie.overview}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!currentMovie) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
          alt={currentMovie.title}
        />
        <CardContent>
          <Typography variant="h5">{currentMovie.title}</Typography>
          <Typography variant="body2">{currentMovie.overview}</Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ThumbDown />}
          onClick={() => handleVote(false)}
        >
          Dislike
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ThumbUp />}
          onClick={() => handleVote(true)}
        >
          Like
        </Button>
      </Box>
    </Box>
  );
}