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

app.post("/chats", async (req, res) => {
  try {
    const {id, title, messages, created_at} = req.body;

    const result = await pool.query(`INSERT INTO chats(id, title, messages, created_at) VALUES(
        $1, $2, $3::jsonb, $4::timestamptz
        ) RETURNING *`,  [id, title, JSON.stringify(messages), created_at]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error.detail || error.message);
    res.status(500).json({ error: "Database error" });
  }

})

app.get("/chats/:id/messages", async (req, res) => {
  const {id} = req.params;
  const result = await pool.query("SELECT messages FROM chats where id= $1", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json(result.rows[0].messages);

})

app.put("/chats/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;   
    const messagesArray = req.body; 
    const result = await pool.query(
      "UPDATE chats SET messages=$1 WHERE id=$2 RETURNING *",
      [JSON.stringify(messagesArray), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(result.rows[0]);                // повертаємо оновлений рядок
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

})

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});