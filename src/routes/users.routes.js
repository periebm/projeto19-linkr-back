import { Router } from "express";
import { createPost, getPosts, getPostsByHashtag } from "../controllers/posts.controllers.js";
import { getUsers } from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.get("/users", getUsers);
//usersRouter.get("/posts/:hashtag", getPostsByHashtag);


export default usersRouter;