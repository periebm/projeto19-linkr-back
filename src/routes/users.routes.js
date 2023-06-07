import { Router } from "express";
import { createPost, getPosts, getPostsByHashtag } from "../controllers/posts.controllers.js";
import { followUser, getFollows, getUsers } from "../controllers/users.controllers.js";
import { authValidate } from "../middlewares/auth.middleware.js";
import { followSchema } from "../schemas/users.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { validateFollows } from "../middlewares/users.middleware.js";

const usersRouter = Router();

usersRouter.get("/users",authValidate,  getUsers);
usersRouter.get("/follow", getFollows);
usersRouter.post("/follow", authValidate, validateSchema(followSchema), validateFollows, followUser);


//usersRouter.get("/posts/:hashtag", getPostsByHashtag);


export default usersRouter;