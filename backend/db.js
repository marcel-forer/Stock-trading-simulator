// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,       // e.g., your PostgreSQL username
  host: process.env.DB_HOST,       // typically 'localhost'
  database: process.env.DB_NAME,   // e.g., 'trading_simulator'
  password: process.env.DB_PASS,   // your PostgreSQL password
  port: process.env.DB_PORT,       // usually 5432
});

module.exports = pool;
