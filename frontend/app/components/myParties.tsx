import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, List, ListItem, ListItemText, Chip, Snackbar } from '@mui/material';
import { styled } from '@mui/system';
import { getUserParties } from '../lib/api';

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

interface Party {
    id: number;
    name: string;
    code: string;
    creator_id: number;
    created_at: Date;
}

const MyParties = () => {
  const [parties, setParties] = useState<Party[]>([]); //I want parties to be an array of Party objects 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        setIsLoading(true);
        const userParties = await getUserParties();
        console.log("userParties ",userParties);
        setParties(userParties);
        console.log("parties ",parties);
      } catch (error) {
        console.error('Error fetching parties:', error);
        setError('Failed to fetch parties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchParties();
  }, []);

  const [copyMessage, setCopyMessage] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleShareParty = (partyId: string) => {
    navigator.clipboard.writeText(partyId).then(() => {
      setCopyMessage('Party code copied to clipboard!');
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 3000); // Close Snackbar after 3 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setCopyMessage('Failed to copy party code');
      setOpenSnackbar(true);
    });
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  else{
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
          My Parties
        </Typography>
        <Box sx={{ backgroundColor: 'white', borderRadius: 4, padding: 4, marginBottom: 4 }}>
          {parties.length > 0 ? (
            <List>
              {parties.map((party) => (
                 <ListItem key={party.id} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <ListItemText
                    primary={party.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          Streaming Services:
                        </Typography>
                        {' '}
                        {/* {party.streaming_services.map((service) => (
                          <Chip key={service} label={service} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))} */}
                      </React.Fragment>
                    }
                  />
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleShareParty(party.code)}
                  >
                    Share
                  </StyledButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" align="center">
              You haven't joined any parties yet.
            </Typography>
          )}
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={copyMessage}
      />
    </Box>
  );
};
}
export default MyParties;