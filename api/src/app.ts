import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import plantsRouter from './routes/plants';
import countriesRouter from './routes/countries';
import testRouter from './routes/test';
import { apiKeyAuth } from './middleware/api-key-auth';


dotenv.config();

const app = express();

// cors middleware
app.use(cors({
  origin: '*', 
  credentials: true,
})); 

app.use(express.json());

// app.use(apiKeyAuth); //todo apply auth to all routes

// Route mounting
// app.use('/test', testRouter);
app.use('/plants', plantsRouter);
app.use('/countries', countriesRouter);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => { // 0.0.0.0 allows connections from outside the container
  console.log(`API running on port ${PORT}`);
});