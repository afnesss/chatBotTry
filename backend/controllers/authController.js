import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid"

export const loginUser = async(req, res) => {
  const {email, password} = req.body;
  console.log("req.body:", req.body); 
  try {
    const result = await pool.query("select * from users where email=$1", [email]);
    if (result.rowCount === 0){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    // const hash = await bcrypt.hash("12345678", 10);
    // console.log(hash);
    const valid = await bcrypt.compare(password, user.user_password);
    if(!valid){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {id: user.id, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    )

    return res.json({token, user: {id: user.id, name: user.name, email: user.email}})

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}

export const registerUser = async(req, res) => {
  const {name, email, password} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const result = await pool.query("insert into users(id, name, email, user_password) values($1, $2, $3, $4) RETURNING id, name, email",
      [id, name, email, hashedPassword]
    )

    res.status(201).json({ user: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // authenticate middleware вже встановив
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};