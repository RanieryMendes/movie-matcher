import React, { useState } from 'react';
import { Box, Typography, Button, Container, TextField, Snackbar } from '@mui/material';
import { styled } from '@mui/system';
import { joinParty } from '../lib/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
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

const JoinParty = ({ onBackToWelcome }) => {
  const [partyCode, setPartyCode] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleJoinParty = async () => {
    try {
      const response = await joinParty(partyCode);
      if (response.code === partyCode)  {
        router.push(`/party/${response.code}`);
      } else {
        setMessage(response.message || 'Failed to join party. Please try again.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error joining party:', error);
      setMessage('An error occurred. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
          Join a Party
        </Typography>
        <Box sx={{ backgroundColor: 'white', borderRadius: 4, padding: 4, marginBottom: 4 }}>
          <TextField
            fullWidth
            label="Party Code"
            variant="outlined"
            value={partyCode}
            onChange={(e) => setPartyCode(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <StyledButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleJoinParty}
          >
            Join Party
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </Box>
  );
};

export default JoinParty;
