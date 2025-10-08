import express from "express";
// import { pool } from "pg";
import cors from "cors";
import chatsRouter from './routes/chats.js';

const PORT = 4002;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/chats', chatsRouter);

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});


