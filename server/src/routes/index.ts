import { Router } from "express";
import authRouter from "../auth/auth.route.ts";
import friendshipsRouter from "../friendships/friendships.route.ts";
import { socketRouter } from "../socket.ts";

const router: Router = Router();
router.use('/socket', socketRouter);
router.use('/auth', authRouter);
router.use('/friendships', friendshipsRouter);

export default router;
