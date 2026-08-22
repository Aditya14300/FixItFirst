const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Category = require("../models/Category");
const User = require("../models/User");

// Get bookings (filtered by customerPhone query if provided, or all for admin)
const getBookings = async (req, res) => {
  try {
    const { phone, customerPhone } = req.query;
    let query = {};
    const targetPhone = phone || customerPhone;

    if (targetPhone) {
      query.customerPhone = targetPhone;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
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
    const { customerName, customerPhone, serviceName, date, timeSlot, address, amount, notes } = req.body;

    if (!customerName || !customerPhone || !serviceName || !date || !timeSlot || !address || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking fields",
      });
    }

    const cleanCustomerName = String(customerName).trim().substring(0, 50);
    const cleanCustomerPhone = String(customerPhone).trim().substring(0, 15);
    const cleanServiceName = String(serviceName).trim().substring(0, 80);
    const cleanAddress = String(address).trim().substring(0, 150);
    const cleanNotes = notes ? String(notes).trim().substring(0, 250) : "";
    const cleanAmount = Number(amount);

    const booking = await Booking.create({
      customerName: cleanCustomerName,
      customerPhone: cleanCustomerPhone,
      serviceName: cleanServiceName,
      date,
      timeSlot,
      address: cleanAddress,
      amount: cleanAmount,
      notes: cleanNotes,
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
