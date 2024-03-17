import express from "express";
import { BookingController } from "../controllers/BookingController";
import { isAgent } from "../middlewares/isAgent";
import { auth } from "../middlewares/auth";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";

const router = express.Router();
const bookingController = new BookingController();

router.post("/newbooking", auth, isAgent, bookingController.createBooking);
router.post("/newcruise", auth, isAgent, bookingController.createCruise);
router.get("/mybookings/:id", auth, bookingController.getMyBookings);
router.get("/allbookings", auth, isSuperAdmin, bookingController.getAllBookings);
router.delete("/:id", auth, isSuperAdmin, bookingController.deleteBooking);


export default router;
