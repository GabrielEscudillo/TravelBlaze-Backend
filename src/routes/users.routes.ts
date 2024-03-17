import express from "express";
import { UserController } from "../controllers/UserController";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { auth } from "../middlewares/auth";


const router = express.Router();
const userController = new UserController();


router.post("/register", userController.register);
router.post("/createagent", auth, isSuperAdmin, userController.createAgent);
router.post("/login", userController.login);
router.get("/:id", auth, userController.getProfile);
router.patch("/:id", auth, userController.update);
router.get("/get/allusers", auth, isSuperAdmin, userController.getAllUsers);
router.delete("/:id", auth, isSuperAdmin, userController.deleteUser);
router.get("/get/agents", userController.getAllAgents);


export default router;