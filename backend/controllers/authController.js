import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { use } from "react";
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

    return res.json({token, user: {id: user.id, name: user.name, email: user.email, profile_pic: user.profile_pic}})

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}

export const registerUser = async(req, res) => {
  const {name, email, password} = req.body;
  console.log('registring...')

  try {
    const check = await pool.query("select * from users where email=$1", [email]);
    if (check.rowCount > 0){
      return res.status(401).json({ error: "Email already in use" });
    }
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

export const updateUserData = async(req, res) => {
  try {
    // const allowedColumns = ['name','profile_pic'];

    // const updates = Object.entries(req.body).filter(
    //   ([key]) => allowedColumns.includes(key)
    // );
    const updates = [];

    // if (updates.length === 0) {
    //   return res.status(400).json({ error: 'No valid fields to update' });
    // }

    const userId = req.userId;
    console.log(typeof(userId))

    if (req.body.name) {
      updates.push(['name', req.body.name]);
    }
    if (req.file) {
      const imagePath = `/uploads/profile_pics/${req.file.filename}`;
      updates.push(['profile_pic', imagePath]);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    const setClause = updates.map(([key], i) => `${key} = $${i+1}`).join(', ');
    console.log(setClause);
    const values = updates.map(([,value]) => value);
    // const {column, value} = req.body;
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, userId]
    );


    console.log('[Update User]', {
      method: req.method,
      path: req.path,
      body: req.body,
      userId: req.userId
    });
    // console.log(result.rowCount)
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}