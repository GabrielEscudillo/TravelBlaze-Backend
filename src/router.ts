import express from "express";
import userRoutes from "./routes/users.routes";
import appointmentRoutes from "./routes/appointments.routes";
import bookingRoutes from "./routes/bookings.routes";

const router = express.Router();

router.use("/users/", userRoutes);
router.use("/appointments/", appointmentRoutes);
router.use("/bookings/", bookingRoutes);

export default router;
