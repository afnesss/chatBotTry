import express from 'express';

import { insertMessage, getMessagesByChatId } from '../controllers/messageController.js';

const router = express.Router({ mergeParams: true }); 

router.get("/messages", getMessagesByChatId);
router.post("/messages", insertMessage);

export default router;
