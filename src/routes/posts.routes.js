import { Router } from "express";
import { createPost, deletePost, getPosts, getPostsByHashtag } from "../controllers/posts.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { postSchema } from "../schemas/posts.schemas.js";
import { authValidate } from "../middlewares/auth.middleware.js";
import { validatePostUser } from "../middlewares/posts.middleware.js";

const postsRouter = Router();

postsRouter.get("/posts", getPosts);
postsRouter.get("/posts/:hashtag", getPostsByHashtag);
postsRouter.post("/posts", authValidate, validateSchema(postSchema), createPost);
postsRouter.delete("/delete/:id", authValidate, validatePostUser, deletePost);

export default postsRouter;