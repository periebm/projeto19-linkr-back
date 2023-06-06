import { db } from "../database/db.connection.js";

export default async function repostValidate(req, res, next) {
  const { id: postId } = req.params;
  try {
    const post = await db.query(
      `
        SELECT * FROM posts WHERE posts.id = $1
        `,
      [postId]
    );
    if (post.rows.length === 0) return res.status(404).send("post not found");

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
