// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signUp } from './../lib/api';


// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';


// export default function SignUpPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       await signUp(email, password);
//       router.push('/auth/login');
//     } catch (error) {
//       setError(error.message || 'Sign-up failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSignUp} className="space-y-4">
//             <Input
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <Input
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="submit"
//               className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Sign Up
//             </button>
//           </form>
//           {error && (
//             <Alert variant="destructive" className="mt-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <a href="/auth/login" className="text-blue-600 hover:underline">
//               Log in
//             </a>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from './../lib/api';
import { Alert, TextField, Button, Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(username, email, password);
      router.push('/auth/login');
    } catch (error) {
      setError(error.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #3f51b5, #9c27b0)' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <CardHeader>
          <Typography variant="h5" component="div" align="center">
            Sign Up
          </Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
              label="Username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Sign Up
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
            Already have an account?{' '}
            <a href="/auth/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Log in
            </a>
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
}
