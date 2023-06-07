import CommentsControllers from "../controllers/comments.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import commentSchema from "../schemas/comment.schema.js";
import { Router } from "express";
import { authValidate } from "../middlewares/auth.middleware.js";

const CommentsRouter = Router();

CommentsRouter.post('/comments', authValidate, validateSchema(commentSchema), CommentsControllers.insertComment);
CommentsRouter.get('/comments/:id', authValidate, CommentsControllers.getCommentsByPostId);

export default CommentsRouter;