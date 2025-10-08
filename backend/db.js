import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chatsTry",
  password: "24628550",
  port: 5454,
});