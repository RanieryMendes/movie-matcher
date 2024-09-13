'use client';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MatchingWelcome from "../components/matchingWelcome";
import BeginNewParty from "../components/beginParty";
import Sidebar from "../components/sideBar";
import { Box } from "@mui/material";
import MyParties from "../components/myParties";
import JoinParty from "../components/joinParty";
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
    },
    secondary: {
      main: '#3B82F6',
    },
  },
});

export default function Matching() {
  const [currentView, setCurrentView] = useState('welcome');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {currentView === 'welcome' && <MatchingWelcome onBeginNewParty={() => setCurrentView('newParty')} onMyParties={() => setCurrentView('myParties')} onJoinParty={() => setCurrentView('joinParty')}/>}
          {currentView === 'newParty' && <BeginNewParty  onBackToWelcome={() => setCurrentView('welcome')} onMyParties={() => setCurrentView('myParties')}/>}
          {currentView === 'myParties' && <MyParties onBackToWelcome={() => setCurrentView('welcome')}/>}
          {currentView === 'joinParty' && <JoinParty onBackToWelcome={() => setCurrentView('welcome')} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}