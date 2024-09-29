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

const getPopularMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/api/movies/popular`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  };
  
  export { getPopularMovies };

  // Add these functions to the existing file

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateProfile = async (profileData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/profile/upload_picture`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: file,
  });
  if (!response.ok) throw new Error('Failed to upload profile picture');
  return response.json();
};

export async function getStreamingPlatforms(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/streaming/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch streaming platforms');
  }
  const data = await response.json();
  return data.platforms;
}

export async function getGenres(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/movies/genres`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  const data = await response.json();
  return data.genres;
}

export async function createParty(partyData: any) {
  const response = await fetch(`${API_BASE_URL}/api/matching/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(partyData),
  });
  if (!response.ok) throw new Error('Failed to create party');
  return response.json();
}

export async function getUserParties() {
  const response = await fetch(`${API_BASE_URL}/api/matching/groups`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch user parties');
  return response.json();
}

export async function getPartyDetails(partyId: string) {
  const response = await fetch(`${API_BASE_URL}/api/matching/groups/${partyId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch party details');
  return response.json();
}


export async function joinParty(partyCode: string) {
  const response = await fetch(`${API_BASE_URL}/api/matching/party/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({ code: partyCode }),
  });
  if (!response.ok) throw new Error('Failed to join party');
  return response.json();
}


export async function deleteParty(partyId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/matching/party/${partyId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
  });

  if (!response.ok) {
      throw new Error('Failed to delete party');
  }
}

export async function startMatchingSession(groupId: string, genre?: string) {

  console.log("In startMatchingSession in Api.ts. The group id is ", groupId);
  const response = await fetch(`${API_BASE_URL}/api/matching/start-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({ code: groupId, genre: genre }),
  });
  if (!response.ok) throw new Error('Failed to start matching session');
  return response.json();
}

export async function getNextMovie(sessionId: number) {
  console.log("In getNextMovie");
  const response = await fetch(`${API_BASE_URL}/api/matching/nextmovie/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to get next movie');
  return response.json();
}

export async function voteMovie(voteData: { session_id: number, movie_id: number, liked: boolean }) {
  const response = await fetch(`${API_BASE_URL}/api/matching/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(voteData),
  });
  if (!response.ok) throw new Error('Failed to submit vote');
  return response.json();
}

export async function getMatchingResult(sessionId: number) {
  const response = await fetch(`${API_BASE_URL}/api/matching/result?session_id=${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to get matching result');
  return response.json();
}

