import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import GroupIcon from '@mui/icons-material/Group';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { createTheme } from '@mui/material/styles';



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

const MatchingWelcome = ({ onBeginNewParty, onMyParties, onJoinParty }) => {
  const buttons = [
    { text: 'My Parties', icon: <GroupIcon />, onClick: onMyParties },
    { text: 'Begin New Party', icon: <CelebrationIcon />, onClick: onBeginNewParty },
    { text: 'Join a Party', icon: <MeetingRoomIcon />, onClick: onJoinParty },
  ];

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
          Welcome to the Matching Page
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {buttons.map((button) => (
            <Grid item xs={12} sm={4} key={button.text}>
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                startIcon={button.icon}
                onClick={button.onClick}
              >
                {button.text}
              </StyledButton>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MatchingWelcome;