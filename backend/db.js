import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || 'chatsTry',
  password: process.env.DB_PASSWORD || '24628550',
  port: process.env.DB_PORT || 5454,
});