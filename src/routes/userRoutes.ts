import { Router } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes (anyone can call)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (require JWT from authMiddleware)
router.get("/me", authMiddleware, userController.getProfile);
router.get("/", authMiddleware, userController.listAll);
router.put("/:id", authMiddleware, userController.update);
router.delete("/:id", authMiddleware, userController.remove);

export default router;