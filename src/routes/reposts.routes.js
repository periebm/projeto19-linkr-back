import { Router } from "express";
import { authValidate, loginValidate } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import authSchemas from "../schemas/auth.schemas.js";
import RepostsControllers from "../controllers/reposts.controllers.js";
import repostValidate from "../middlewares/reposts.middleware.js";

const repostsControllers = new RepostsControllers();

const repostsRouter = Router();

repostsRouter.post("/repost/:id", authValidate, repostValidate,repostsControllers.repost);

export default repostsRouter;
