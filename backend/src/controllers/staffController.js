const Staff = require("../models/Staff");

// Get all staff & technicians
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new staff or technician
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialization } = req.body;
    const staff = await Staff.create({
      name,
      email,
      phone,
      password,
      role: role || "technician",
      specialization: specialization || "Home Repair Expert",
    });
    res.status(201).json({
      success: true,
      staff,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStaff,
  createStaff,
};
