import { Router } from "express";
import { register, login, current, logout } from "../controllers/sessions.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateStrategy } from "../middlewares/passport.middleware.js";

const router = Router();

router.post("/register", authenticateStrategy("register", 400), register);
router.post("/login", authenticateStrategy("login", 401, "Credenciales inválidas"), login);
router.get("/current", authenticate, current);
router.post("/logout", logout);

export default router;
