const mongoose = require("mongoose");

const instaBookingSchema = new mongoose.Schema(
  {
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      default: "Valued Customer",
      trim: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI Instant", "Pay After Service", "upi_instant", "pay_after", "UPI", "COD"],
      required: true,
      default: "Pay After Service",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InstaBooking", instaBookingSchema, "Insta-bookings");
