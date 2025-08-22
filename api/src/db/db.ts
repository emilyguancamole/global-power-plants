import { Pool } from 'pg'; // connection pool so multiple API requests don’t create new DB connections
import dotenv from 'dotenv';
dotenv.config();

console.log('DB config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
});
// Database connection pool
const db = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5433),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default db;