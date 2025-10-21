import express from "express";
// import { pool } from "pg";
import cors from "cors";
import chatsRouter from './routes/chats.js';
import authRouter from './routes/authRoutes.js';
import aiRouter from './routes/aiRoutes.js'

const PORT = process.env.PORT || 4002;
console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "✅ loaded" : "❌ missing");
console.log("PORT is:", process.env.PORT ? "✅ loaded" : "❌ missing");
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/chats', chatsRouter);
app.use('/ai', aiRouter);


app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});


