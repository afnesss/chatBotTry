import express from "express";
// import { pool } from "pg";
import cors from "cors";
import chatsRouter from './routes/chats.js';
import authRouter from './routes/authRoutes.js';
import aiRouter from './routes/aiRoutes.js'
import { fileURLToPath } from "url";
import path from "path";
// import authenticate from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4002;
console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "✅ loaded" : "❌ missing");
console.log("PORT is:", process.env.PORT ? "✅ loaded" : "❌ missing");
const app = express();

// Basic request logger to help debug proxy/route issues
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure CORS for your Netlify frontend
app.use(cors({
  origin: ['https://chatbot-afnesssfull1.netlify.app', 'http://localhost:4000', 'https://chat-bot-try-frontend.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/auth',authRouter);
app.use('/chats', chatsRouter);
app.use('/ai', aiRouter);


// app.listen(PORT, () => {
//   console.log("Backend running on http://localhost:" + PORT);
// });

app.listen(PORT, () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const baseUrl = isDevelopment 
    ? `http://localhost:${PORT}`
    : 'https://chatbottry-4.onrender.com';
    
  console.log(`Backend running on ${baseUrl}`);
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

