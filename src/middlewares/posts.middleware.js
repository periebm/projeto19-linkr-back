import PostsRepository from "../repositories/posts.repository.js";

export async function validatePostUser(req, res, next) {
  const { id } = req.params;

  try {
    const post = await PostsRepository.getPostsbyIdDB(id);
    if (post.rows[0].user_id !== res.locals.session.rows[0].id) return res.sendStatus(405);

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}