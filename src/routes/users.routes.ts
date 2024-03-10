import express from "express";
import { UserController } from "../controllers/UserController";


const router = express.Router();
const userController = new UserController();


router.post("/register", userController.register);
router.post("/createagent", userController.createAgent);
router.post("/login", userController.login);
router.get("/:id", userController.getProfile);
router.patch("/:id", userController.update);
router.get("/get/allusers", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.get("/get/agents", userController.getAllAgents);


export default router;