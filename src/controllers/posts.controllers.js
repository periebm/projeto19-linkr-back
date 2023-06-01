import extractHashtags from "../helpers/extractHashtags.js";
import PostsRepository from "../repositories/posts.repository.js";
import TrendingsRepository from "../repositories/trendings.repository.js";

export async function getPosts(req, res) {
  try {
    const posts = await PostsRepository.getPosts();
    res.status(200).send(posts.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function createPost(req, res) {
  try {
    const { user_id, description, url } = req.body;

    const hashtags = extractHashtags(description);

    const { rows } = await PostsRepository.createPost(user_id, description, url);

    if (hashtags.length > 0) {
      for (let i = 0; i < hashtags.length; i++) {
        await TrendingsRepository.createTrending(hashtags[i], rows[0].id);
      }
    }

    res.status(201).json({ message: 'Post criado' });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getPostsByHashtag(req, res) {
  const { hashtag } = req.params;

  try {
    const { rows } = await PostsRepository.getPostsByHashTag(hashtag);
    res.status(200).send(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
}