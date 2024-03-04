import express from "express";
import { UserController } from "../controllers/UserController";


const router = express.Router();
const userController = new UserController();


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:id", userController.getProfile);
router.patch("/:id", userController.update);

export default router;