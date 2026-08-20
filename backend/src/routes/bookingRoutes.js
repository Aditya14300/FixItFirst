const express = require("express");
const router = express.Router();
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");

router.route("/").get(getBookings).post(createBooking);
router.route("/:id/status").put(updateBookingStatus);
router.route("/:id/cancel").put(cancelBooking);

module.exports = router;
