import { pool } from "../db.js";

export const chatExists = async (chatId, userId) => {
  
  const chatCheck = await pool.query(
      "SELECT title FROM chats WHERE id = $1 and user_id=$2",
      [chatId, userId]
    );

  if (chatCheck.rows.length > 0) {
    return {
      exists: true,
      title: chatCheck.rows[0].title
    };
  } else {
    return {
      exists: false,
      title: null
    };
  }
}

export const getChatsTitles = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query("SELECT id, title FROM chats where user_id=$1", [userId]);
    return res.json(result.rows);  // завжди повертає валідний JSON
  } catch (error) {
    console.error("Database error fetching chat titles:", error.message);
    return res.status(500).json({ error: "Database error fetching chat titles" });
  }
}

export const changeChatTitle = async(req, res) => {
  try {
    const {title} = req.body;
    const {id} = req.params;
    const userId = req.userId;
    const result = await pool.query(`UPDATE chats SET title=$1 where id=$2 and user_id=$3 RETURNING *`,  [title, id, userId]);

    if (result.rowCount === 0){
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }
}

export const createChat = async(req, res) => {
  try {
    const {id, title, created_at} = req.body;
    const userId = req.userId;
    const result = await pool.query(`INSERT INTO chats(id, title, created_at, user_id) VALUES(
        $1, $2, $3::timestamptz, $4
        ) RETURNING *`,  [id, title, created_at, userId]);

    return res.json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }
}

export const getLastChats = async(req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(`SELECT * FROM chats
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' and user_id=$1
    ORDER BY created_at DESC;`, [userId]);

    return res.json(result.rows);

  } catch (error) {
    console.error("Database error quering chats:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }
}

export const deleteChat = async(req, res) => {
  try{
    const {id} = req.params;
    const userId = req.userId;
    const result = await pool.query("DELETE FROM chats WHERE id=$1 and user_id=$2 RETURNING *", [id, userId]);
    

    const resultMsg = await pool.query("DELETE FROM messagesTable WHERE chat_id=$1 RETURNING *", [id]);

    if (result.rowCount === 0){
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ success: true, deleted: result.rows[0] });
  } catch (err){
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export const findChatBySearch = async(req, res) => {
  try {
    const { search } = req.body;
  const userId = req.userId;  
    const result = await pool.query(`select chats.id, chats.title, chats.created_at from chats 
      join messagesTable on chats.id=messagesTable.chat_id 
      where chats.user_id=$1 and (chats.title ilike $2 or messagesTable.message ilike $2)
      GROUP BY chats.id, chats.title, chats.created_at
        ORDER BY chats.created_at DESC`, [userId,`%${search}%`]);

    return res.json(result.rows);
  } catch (error) {
    console.error('error finding chat: ', error.message);
    res.status(500).json({error: "Database error" });
  }
  
}

export const checkingChat = async(req, res) => {
    const { id: chatId } = req.params;
    const userId = req.userId;  
  try {
    const result = await chatExists(chatId, userId);

    if (!result || typeof result !== "object") {
      return res.status(500).json({ error: "Invalid result from chatExists" });
    }
    return res.json(result);
  } catch (error) {
    console.error('error checking chat: ', error.message);
    res.status(500).json({error: "Database error" });
  }
}

