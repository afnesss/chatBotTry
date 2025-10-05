import express from "express";
import pkg from "pg";
import cors from "cors";

const PORT = 4002;
const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chatsTry",
  password: "24628550",
  port: 5454,
});

app.get("/chats/titles", async (req, res) => {
  const result = await pool.query("SELECT id,title FROM chats");
  console.log(res.json(result.rows));
  res.json(result.rows);
});

app.put("/chats/:id", async (req, res) => {
  try {
    const {title} = req.body;
    const {id} = req.params;

    const result = await pool.query(`UPDATE chats SET title=$1 where id=$2 RETURNING *`,  [title, id]);

    if (result.rowCount === 0){
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }

})

app.post("/chats", async (req, res) => {
  try {
    const {id, title, created_at} = req.body;

    const result = await pool.query(`INSERT INTO chats(id, title, created_at) VALUES(
        $1, $2, $3::timestamptz
        ) RETURNING *`,  [id, title, created_at]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }

})

app.get("/chats", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM chats
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY created_at DESC;`);

    res.json(result.rows);

  } catch (error) {
    console.error("Database error quering chats:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }
})

app.delete("/chats/:id", async (req, res) => {
  try{
    const {id} = req.params;
    const result = await pool.query("DELETE FROM chats WHERE id=$1 RETURNING *", [id]);

    const resultMsg = await pool.query("DELETE FROM messagesTable WHERE chat_id=$1 RETURNING *", [id]);

    if (result.rowCount === 0){
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err){
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
})

app.get("/chats/:id/messages", async (req, res) => {
  const {id} = req.params;
    const result = await pool.query(
      "SELECT id, sender, message, loading FROM messagesTable WHERE chat_id = $1",
      [id]
    );

  res.json(result.rows);

})

app.post("/chats/:id/messages", async (req, res) => {
  try {
    const { id } = req.params; // chat_id
    const { sender, message, loading, } = req.body;

    const result = await pool.query(
      `INSERT INTO messagesTable (chat_id, sender, message, loading)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, sender, message, loading || false]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error inserting message:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/chats/find", async (req, res) => {
  try {
    const { search } = req.body;

    const result = await pool.query(`select chats.id, chats.title, chats.created_at from chats 
      join messagesTable on chats.id=messagesTable.chat_id 
      where chats.title ilike $1 or messagesTable.message ilike $1 
      GROUP BY chats.id, chats.title, chats.created_at
       ORDER BY chats.created_at DESC`, [`%${search}%`]);

    res.json(result.rows);
  } catch (error) {
    console.error('error finding chat: ', error.message);
    res.status(500).json({error: "Database error" });
  }

})

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});