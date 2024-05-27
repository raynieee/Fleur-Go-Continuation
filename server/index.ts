// server/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Express server is running');
});

// Handle sign-in logic
app.post('/api/sign-in', (req, res) => {
  const { email, password } = req.body;
  
  // Placeholder logic for authentication
  if (email === 'test@example.com' && password === 'password') {
    res.json({ message: 'Sign-in successful', email });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
