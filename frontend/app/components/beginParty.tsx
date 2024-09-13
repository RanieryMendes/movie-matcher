import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, TextField, Autocomplete, Chip, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/system';
import { getStreamingPlatforms, getGenres, createParty } from '../lib/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
}));

const BeginNewParty = ({ onBackToWelcome, onMyParties, }) => {
  const [partyName, setPartyName] = useState('');
  const [streamingServices, setStreamingServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [includeGenres, setIncludeGenres] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const platforms = await getStreamingPlatforms();
        setStreamingServices(platforms);
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCreateParty = async () => {
    const data = await createParty({
      name: partyName,
      streaming_services: selectedServices,
      genres_preference: includeGenres ? selectedGenres : [],
    });
    // TODO: Implement party creation logic
    console.log('Creating party:', {
      name: partyName,
      streamingServices: selectedServices,
      genres: includeGenres ? selectedGenres : [],
    })
    
    console.log('Party created:', data);
    onMyParties();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
          Begin New Party
        </Typography>
        <Box sx={{ backgroundColor: 'white', borderRadius: 4, padding: 4, marginBottom: 4 }}>
          <TextField
            fullWidth
            label="Party Name"
            variant="outlined"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Autocomplete
            multiple
            options={streamingServices}
            renderInput={(params) => <TextField {...params} label="Streaming Services" variant="outlined" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            value={selectedServices}
            onChange={(_, newValue) => setSelectedServices(newValue)}
            sx={{ marginBottom: 3 }}
          />
          <FormControlLabel
            control={<Switch checked={includeGenres} onChange={(e) => setIncludeGenres(e.target.checked)} />}
            label="Include Preferred Genres"
            sx={{ marginBottom: 2 }}
          />
          {includeGenres && (
            <Autocomplete
              multiple
              options={genres}
              renderInput={(params) => <TextField {...params} label="Preferred Genres" variant="outlined" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              value={selectedGenres}
              onChange={(_, newValue) => setSelectedGenres(newValue)}
              sx={{ marginBottom: 3 }}
            />
          )}
          <StyledButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateParty}
          >
            Create Party
          </StyledButton>
        </Box>
        <StyledButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={onBackToWelcome}
          startIcon={<ArrowBackIcon />}
        >
          Return
        </StyledButton>
      </Container>
    </Box>
  );
};

export default BeginNewParty;