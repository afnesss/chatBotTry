import express from 'express';

import { insertMessage, getMessagesByChatId } from '../controllers/messageController.js';

const router = express.Router({ mergeParams: true }); 

// router.use(authenticate);

router.get("/", getMessagesByChatId);
router.post("/", insertMessage);

export default router;
