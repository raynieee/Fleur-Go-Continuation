import { useClerk } from '@clerk/nextjs';
import axios from 'axios';

const refreshAccessTokenIfNeeded = async () => {
  const { session } = useClerk();

  if (session) {
    const token = await session.getToken();

    // Update axios headers with the refreshed token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const exampleFunction = async () => {
  await refreshAccessTokenIfNeeded();
  // Proceed with making the request
};

exampleFunction();
