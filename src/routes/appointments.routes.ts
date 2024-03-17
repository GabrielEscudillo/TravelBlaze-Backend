import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { auth } from "../middlewares/auth";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { isAgent } from "../middlewares/isAgent";

const router = express.Router();
const appointmentController = new AppointmentController();

router.post("/newAppointment", auth, appointmentController.create)
router.patch("/:id", auth, appointmentController.updateAppointment)
router.delete("/:id", auth, appointmentController.deleteAppointment)
router.get("/agent/:id", auth, isAgent, appointmentController.getByAgent)
router.get("/user/:id", auth, appointmentController.getById)
router.get("/allappointments", auth, isSuperAdmin, appointmentController.getAllAppointments)
router.get("/allservices", appointmentController.getAllServices)



export default router;
