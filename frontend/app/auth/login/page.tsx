'use client';

import AuthForm from '../../components/AuthForm';
import SignInForm from '../../components/SignInForm';
import { signIn} from '../../lib/api';


import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (data: { username:string, password: string }) => {
    try {
      await signIn(data.username, data.password);
      router.push('/'); // Redirect to login page after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return <SignInForm onSubmit={handleSignIn} />;
}
