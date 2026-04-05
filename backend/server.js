import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/routes.js';
import cookieParser from 'cookie-parser';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
dotenv.config(); 

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
