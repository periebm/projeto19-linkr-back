import { db } from "../database/db.connection.js";

export default class RepostsControllers {
  async repost(req, res) {
    const { id: postId } = req.params;
    const { userId } = res.locals;
    try {
      await db.query(
        `
        INSERT INTO reposts (user_id, post_id) VALUES ($1, $2)
        `,
        [userId, postId]
      );
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
