import { Router } from "express"
import postsRouter from "./posts.routes.js"
import trendingRouter from "./trendings.routes.js";

const router = Router()

router.use(postsRouter)
router.use(trendingRouter)


export default router