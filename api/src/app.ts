import express from 'express';
import dotenv from 'dotenv';
import plantsRouter from './routes/plants';
import countriesRouter from './routes/countries';
import testRouter from './routes/test';

dotenv.config();

const app = express();
app.use(express.json());

// Route mounting
app.use('/test', testRouter);
app.use('/plants', plantsRouter);
app.use('/countries', countriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});