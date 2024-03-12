import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { auth } from "../middlewares/auth";

const router = express.Router();
const appointmentController = new AppointmentController();

router.post("/newAppointment", appointmentController.create)
router.patch("/:id", appointmentController.updateAppointment)
router.delete("/:id", appointmentController.deleteAppointment)
router.get("/agent/:id", appointmentController.getByAgent)
router.get("/user/:id", appointmentController.getById)
router.get("/allappointments", appointmentController.getAllAppointments)
router.get("/allservices", appointmentController.getAllServices)



export default router;
