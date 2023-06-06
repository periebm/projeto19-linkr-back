import extractHashtags from "../helpers/extractHashtags.js";
import PostsRepository from "../repositories/posts.repository.js";
import TrendingsRepository from "../repositories/trendings.repository.js";

export async function getPosts(req, res) {
  try {
    const user_id = res.locals.userId
    const posts = await PostsRepository.getPosts(user_id);
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

export async function likePost(req, res){
  const {user_id, post_id} = req.body
  try {
    const data = await PostsRepository.checkLike(user_id, post_id)
    if(data.rows.length !== 0) return res.status(409).send("Usuario ja deu like nesse post")

    await PostsRepository.likePost(user_id, post_id)
    res.status(201).json({message: 'Like adicionado'})
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function deleteLike(req, res){
  const {user_id, post_id} = req.body
  try {
    const data = await PostsRepository.checkLike(user_id, post_id)
    if(data.rows.length !== 1) return res.status(409).send("Usuario nao deu like nesse post")

    await PostsRepository.deleteLike(user_id, post_id)
    res.status(200).json({message: 'Like deletado'})
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getPostsByHashtag(req, res) {
  const { hashtag } = req.params;
  const user_id = res.locals.userId
  try {
    const { rows } = await PostsRepository.getPostsByHashTag(hashtag, user_id);
    res.status(200).send(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;

  try {
    PostsRepository.deletePostLikes(id);
    PostsRepository.deletePostTrendings(id);
    PostsRepository.deletePost(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function updatePost(req, res) {
  const { id } = req.params;
  const { description } = req.body;

  const hashtags = extractHashtags(description);

  try {

    const { rows } = await TrendingsRepository.getTrendingIdByPost(id);

    rows.forEach(async (row) => {
      if (!hashtags.includes(row.name)) {
        await TrendingsRepository.deleteTrendingById(row.trending_id, id);
      }
    });

    for (let i = 0; i < hashtags.length; i++) {
      await TrendingsRepository.createTrending(hashtags[i], id);
    }


    PostsRepository.update(description, id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getPostsById(req, res) {
  const { id } = req.params;
  
  try {
    const posts = await PostsRepository.getPostsbyIdDB(res.locals.userId, id);
    res.status(200).send(posts.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
}