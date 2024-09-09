import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from './../lib/api';
import { Alert, TextField, Button, Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material';

export default function SignInForm() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(username, password);
      localStorage.setItem('accessToken', data["access_token"]);
      router.push('/');
    } catch (error) {
      setError(error.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #3f51b5, #9c27b0)' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <CardHeader>
          <Typography variant="h5" component="div" align="center">
            Sign In
          </Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
              label="Username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
            >
             Log In
            </Button>
          </form>
          {error && (
            <Alert severity="error" style={{ marginTop: '16px' }}>
              {error}
            </Alert>
          )}
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <a href="/auth/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Sign up
            </a>
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
}
