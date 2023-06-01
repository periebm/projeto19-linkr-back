import { Router } from "express"
import postsRouter from "./posts.routes.js"
import trendingRouter from "./trendings.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use(postsRouter)
router.use(trendingRouter)
router.use(authRouter);

export default router;
