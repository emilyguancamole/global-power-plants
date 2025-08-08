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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});