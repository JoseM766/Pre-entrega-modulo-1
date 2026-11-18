import { Router } from "express";
import { listUsers, getUserById } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { USER_ROLES } from "../constants/index.js";

const router = Router();

router.get("/", authenticate, authorize([USER_ROLES.ADMIN]), listUsers);
router.get("/:id", authenticate, authorize([USER_ROLES.ADMIN]), getUserById);

export default router;
