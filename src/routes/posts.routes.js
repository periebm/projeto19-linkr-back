import { Router } from "express";
import { createPost, getPosts, getPostsByHashtag } from "../controllers/posts.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { postSchema } from "../schemas/posts.schemas.js";

const postsRouter = Router();

postsRouter.get("/posts", getPosts);
postsRouter.get("/posts/:hashtag", getPostsByHashtag);
postsRouter.post("/posts", validateSchema(postSchema), createPost);

export default postsRouter;