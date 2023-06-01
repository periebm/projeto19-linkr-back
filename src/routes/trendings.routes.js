import { Router } from "express";
import { getTrendings } from "../controllers/trendings.controllers.js";

const trendingRouter = Router();

trendingRouter.get("/trendings", getTrendings);

export default trendingRouter;