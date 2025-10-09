import { pool } from "../db.js";

import { chatExists } from "./chatController.js";

export const insertMessage = async(req, res) => {
  try {
    const { id: chatId } = req.params; // chat_id
    const {id: messageId, sender, message} = req.body;

    const chatCheck = await chatExists(chatId);
    let resChat = null;
    if (!chatCheck) {
      const res = await pool.query(
        "INSERT INTO chats (id, title, created_at) VALUES ($1, $2, NOW()) RETURNING *",
        [chatId, "My New Chat"]
      );
      resChat = res.rows[0];

      console.log(`Chat ${chatId} створено`);
    }

    const result = await pool.query(
      `INSERT INTO messagesTable (id, chat_id, sender, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [messageId, chatId, sender, message]
    );

    res.json({
      success: true,
      chatCreated: !!resChat,
      chat: resChat,
      message: result.rows
    });
  } catch (error) {
    console.error("Error inserting message:", error.message);
    res.status(500).json({ error: "Database error" });
  }
}

export const getMessagesByChatId = async(req, res) => {
  const {id} = req.params;
    const result = await pool.query(
      "SELECT id, sender, message FROM messagesTable WHERE chat_id = $1 order by created_at asc",
      [id]
    );

  res.json(result.rows);
}