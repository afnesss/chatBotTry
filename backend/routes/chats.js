import express from 'express';

import { getChatsTitles, changeChatTitle, createChat, getLastChats, deleteChat, findChatBySearch, checkingChat} from '../controllers/chatController.js';
import messageRouter from './messages.js';

const router = express.Router();

router.get("/titles", getChatsTitles);

router.post("/", createChat);
router.get("/", getLastChats);

router.post("/find", findChatBySearch);

router.put("/:id", changeChatTitle);
router.delete("/:id", deleteChat);
router.get("/:id", checkingChat);

router.use("/:id", messageRouter)

export default router;