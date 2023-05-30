import { db } from "../database/db.connection.js";

export async function getPosts(req, res) {
    try {
      const posts = await db.query(`SELECT * FROM posts ORDER BY createdAt DESC LIMIT 20`);
      res.status(200).send(posts.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  export async function createPost(req, res) {
    try {
      const { user_id, description, url } = req.body;
  
      await db.query(`
      INSERT INTO posts (user_id, description, url)
      VALUES ($1, $2, $3)
    `, [user_id, description, url]);
  
      res.status(201).json({ message: 'Post criado' });
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
  