import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { USER_ROLES } from "../constants/index.js";

const router = Router();

// Públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protegidas: solo admin
router.post("/", authenticate, authorize([USER_ROLES.ADMIN]), createProduct);
router.put("/:id", authenticate, authorize([USER_ROLES.ADMIN]), updateProduct);
router.delete("/:id", authenticate, authorize([USER_ROLES.ADMIN]), deleteProduct);

export default router;
