import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers.js";
import { loginValidate } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import authSchemas from "../schemas/auth.schemas.js";

const authControllers = new AuthControllers();

const authRouter = Router();

authRouter.post("/auth/signup", validateSchema(authSchemas.schemaSignUp), authControllers.signUp);
authRouter.post(
  "/auth/login",
  validateSchema(authSchemas.schemaLogin),
  loginValidate,
  authControllers.login
);

export default authRouter;
