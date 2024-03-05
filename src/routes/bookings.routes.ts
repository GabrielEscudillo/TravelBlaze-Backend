import express from "express";
import { BookingController } from "../controllers/BookingController";

const router = express.Router();
const bookingController = new BookingController();

router.post("/newflight", bookingController.createFlight);

export default router;
