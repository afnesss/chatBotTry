import express from 'express';

import { getChatsTitles, changeChatTitle, createChat, getChats, deleteChat, findChatBySearch, checkingChat} from '../controllers/chatController.js';
import messageRouter from './messages.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get("/titles", getChatsTitles);

router.post("/", createChat);
router.get("/", getChats);

router.post("/find", findChatBySearch);

router.put("/:id", changeChatTitle);
router.delete("/:id", deleteChat);
router.get("/:id", checkingChat);

router.use("/:id/messages", messageRouter)

export default router;