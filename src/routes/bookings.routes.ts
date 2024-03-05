import express from "express";
import { BookingController } from "../controllers/BookingController";

const router = express.Router();
const bookingController = new BookingController();

router.post("/newbooking", bookingController.createBooking);
router.post("/newcruise", bookingController.createCruise);
router.get("/mybookings/:id", bookingController.getMyBookings);


export default router;
