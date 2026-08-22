const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // App icon identifier (e.g. "ac_unit_rounded", "electrical_services_rounded")
    icon: {
      type: String,
      default: "",
    },

    // Image URL used in website
    image: {
      type: String,
      default: "",
    },

    // Total number of bookings for this category
    bookingCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema, "categories");