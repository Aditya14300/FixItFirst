const Booking = require("../models/Booking");
const InstaBooking = require("../models/InstaBooking");
const Service = require("../models/Service");
const Category = require("../models/Category");
const User = require("../models/User");

// Get bookings (filtered strictly by customerPhone query parameter)
const getBookings = async (req, res) => {
  try {
    const { phone, customerPhone, all } = req.query;
    const targetPhone = phone || customerPhone;
    let query = {};

    if (targetPhone) {
      query.customerPhone = String(targetPhone).trim();
    } else if (all !== "true") {
      // Security fix: If no phone parameter provided, return empty array to prevent leaking all database bookings!
      return res.status(200).json({
        success: true,
        count: 0,
        bookings: [],
      });
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    const instaBookings = await InstaBooking.find(query).sort({ createdAt: -1 });

    // Combine and deduplicate bookings
    const combined = [...bookings];
    const existingIds = new Set(combined.map((b) => b._id.toString()));
    
    for (const ib of instaBookings) {
      if (!existingIds.has(ib._id.toString())) {
        combined.push({
          _id: ib._id,
          customerName: ib.customerName,
          customerPhone: ib.customerPhone,
          serviceName: ib.serviceName,
          date: ib.date,
          timeSlot: ib.timeSlot,
          address: ib.address,
          amount: ib.amount,
          status: ib.status,
          notes: `Payment: ${ib.paymentMethod}`,
          createdAt: ib.createdAt,
        });
        existingIds.add(ib._id.toString());
      }
    }

    // Sort by newest first
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: combined.length,
      bookings: combined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a booking, increment Category bookingCount & update User address
const createBooking = async (req, res) => {
  try {
    const { customerName, customerPhone, serviceName, date, timeSlot, address, amount, notes, paymentMethod } = req.body;

    if (!customerPhone || !serviceName || !date || !timeSlot || !address || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking fields (phone, service, date, timeSlot, address, amount)",
      });
    }

    const cleanCustomerName = customerName ? String(customerName).trim().substring(0, 50) : "Valued Customer";
    const cleanCustomerPhone = String(customerPhone).trim().substring(0, 15);
    const cleanServiceName = String(serviceName).trim().substring(0, 80);
    const cleanAddress = String(address).trim().substring(0, 150);
    const cleanNotes = notes ? String(notes).trim().substring(0, 250) : "";
    const cleanAmount = Number(amount);
    const cleanPaymentMethod = paymentMethod || (notes && notes.includes("UPI Instant") ? "UPI Instant" : "Pay After Service");

    // 1. Save directly under new collection "Insta-bookings" in FixItFirst database
    let instaBooking = null;
    try {
      instaBooking = await InstaBooking.create({
        customerName: cleanCustomerName,
        customerPhone: cleanCustomerPhone,
        serviceName: cleanServiceName,
        date,
        timeSlot,
        address: cleanAddress,
        paymentMethod: cleanPaymentMethod,
        amount: cleanAmount,
        notes: cleanNotes,
      });
      console.log("✅ Booking saved to Insta-bookings collection:", instaBooking._id);
    } catch (instaErr) {
      console.error("Insta-bookings collection save error:", instaErr.message);
    }

    // 2. Save in primary Booking collection for admin & user history sync
    const booking = await Booking.create({
      customerName: cleanCustomerName,
      customerPhone: cleanCustomerPhone,
      serviceName: cleanServiceName,
      date,
      timeSlot,
      address: cleanAddress,
      amount: cleanAmount,
      notes: `Payment: ${cleanPaymentMethod} | Notes: ${cleanNotes}`,
    });

    // Auto-update customer address column in User collection
    try {
      if (cleanCustomerPhone && cleanAddress) {
        await User.findOneAndUpdate(
          { phone: cleanCustomerPhone },
          { address: cleanAddress }
        );
      }
    } catch (e) {
      console.log('Update user address error:', e);
    }

    // Auto-increment bookingCount on parent Category
    try {
      const matchedService = await Service.findOne({ name: { $regex: cleanServiceName, $options: 'i' } });
      if (matchedService && matchedService.category) {
        await Category.findByIdAndUpdate(matchedService.category, { $inc: { bookingCount: 1 } });
      }
    } catch (e) {
      console.log('Increment booking count error:', e);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel a booking by customer with cancellation reason
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, cancellationReason } = req.body;
    const finalReason = String(reason || cancellationReason || 'Cancelled by customer').trim().substring(0, 200);

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancellationReason: finalReason,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking,
};
