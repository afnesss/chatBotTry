import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid"

export const loginUser = async(req, res) => {
  const {email, password} = req.body;

  try {
    const result = await pool.query("select * from users where email=$1", [email]);
    if (result.rowCount === 0){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

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

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
