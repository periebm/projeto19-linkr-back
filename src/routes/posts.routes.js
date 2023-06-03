import { Router } from "express";
import { createPost, deleteLike, deletePost, getPosts, getPostsByHashtag, updatePost, likePost, getPostsById } from "../controllers/posts.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { likeSchema, postSchema, UpdatePostSchema } from "../schemas/posts.schemas.js";
import { authValidate } from "../middlewares/auth.middleware.js";
import { validatePostUser } from "../middlewares/posts.middleware.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidate, getPosts);
postsRouter.get("/posts/:hashtag", authValidate, getPostsByHashtag);
postsRouter.get("/posts/user/:id", authValidate, getPostsById);
postsRouter.post("/posts", authValidate, validateSchema(postSchema), createPost);
postsRouter.delete("/delete/:id", authValidate, validatePostUser, deletePost);
postsRouter.put("/posts/update/:id", authValidate, validateSchema(UpdatePostSchema), validatePostUser, updatePost);
postsRouter.post("/like", authValidate, validateSchema(likeSchema), likePost);
postsRouter.delete("/like", authValidate, validateSchema(likeSchema), deleteLike);

export default postsRouter;