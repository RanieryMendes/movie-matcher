const API_BASE_URL = 'http://localhost:8000';

const signUp = async (username:string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error('Signup failed');
  return response.json();
};

export { signUp };

//write signIn function
const signIn = async (username:string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }); 
  if (!response.ok) throw  new Error('Signin failed');

  return response.json();
}
export { signIn };