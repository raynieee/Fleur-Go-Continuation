// pages/api/sign-in.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await axios.post('http://localhost:3000/auth/sign-in', req.body);
      res.status(200).json(response.data);
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: 'Error signing in', error: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
