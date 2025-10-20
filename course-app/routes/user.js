import { Router } from "express";
const router = Router();// router can be userrouter or authrouter`
import {sighup,signin} from '../controllers/authController.js';
import {courses} from '../controllers/courseController.js';

router.post("/signup",sighup);
router.post("/signin",signin);
router.get("/courses",courses);

export default router;