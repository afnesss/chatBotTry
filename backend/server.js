import express from "express";
// import { pool } from "pg";
import cors from "cors";
import chatsRouter from './routes/chats.js';
import authRouter from './routes/authRoutes.js';
import aiRouter from './routes/aiRoutes.js'
// import authenticate from '../middleware/auth.js';

const PORT = process.env.PORT || 4002;
console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "✅ loaded" : "❌ missing");
console.log("PORT is:", process.env.PORT ? "✅ loaded" : "❌ missing");
const app = express();

// Basic request logger to help debug proxy/route issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use('/auth',authRouter);
app.use('/chats', chatsRouter);
app.use('/ai', aiRouter);


// app.listen(PORT, () => {
//   console.log("Backend running on http://localhost:" + PORT);
// });

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
  console.log("\nRegistered /auth routes:");
  authRouter.stack.forEach(layer => {
    if (layer.route) {
      console.log(`  ${Object.keys(layer.route.methods)[0].toUpperCase()} /auth${layer.route.path}`);
    }
  });
  console.log("\nRegistered /chats routes:");
  chatsRouter.stack.forEach(layer => {
    if (layer.route) {
      console.log(`  ${Object.keys(layer.route.methods)[0].toUpperCase()} /chats${layer.route.path}`);
    }
  });
});

