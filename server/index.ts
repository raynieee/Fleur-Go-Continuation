import dotenv from 'dotenv';
import createServer from './src/routes/server';

dotenv.config();

const port = process.env.NEXT_PUBLIC_SERVER_URL || 8080;
const app = createServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});