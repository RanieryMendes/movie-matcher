'use client';

import AuthForm from '../../components/AuthForm';
import { signUp } from './../../lib/api';


import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (data: { username:string, email: string; password: string }) => {
    try {
      await signUp(data.username, data.email, data.password);
      router.push('/auth/login'); // Redirect to login page after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return <AuthForm onSubmit={handleSignUp} />;
}
