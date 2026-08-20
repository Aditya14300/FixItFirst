const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check required fields
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (Name, Phone, Password)",
      });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = (email && email.trim().length > 0) ? email.trim().toLowerCase() : null;
    const targetRole = role || "customer";
    const isStaffRole = ["technician", "staff", "admin"].includes(targetRole);

    const Model = isStaffRole ? Staff : User;

    // Check if user already exists
    const queryConditions = [{ phone: cleanPhone }];
    if (cleanEmail) {
      queryConditions.push({ email: cleanEmail });
    }

    const existingAccount = await Model.findOne({
      $or: queryConditions,
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account with this phone number or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user/staff object
    const accountData = {
      name: name.trim(),
      phone: cleanPhone,
      password: hashedPassword,
      role: targetRole,
    };

    if (cleanEmail) {
      accountData.email = cleanEmail;
    }

    const account = await Model.create(accountData);

    const userResponse = {
      id: account._id,
      name: account.name,
      email: account.email || "",
      phone: account.phone,
      role: account.role,
    };

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and Password are required",
      });
    }

    const cleanPhone = phone.trim();

    // Check Users collection first, then Staff collection
    let account = await User.findOne({ phone: cleanPhone });
    if (!account) {
      account = await Staff.findOne({ phone: cleanPhone });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(account._id);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: account._id,
        name: account.name,
        phone: account.phone,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const resetPassword = async (req, res) => {
  try {
    const { phone, newPassword, confirmPassword } = req.body;

    if (!phone || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Phone number and new password are required",
      });
    }

    if (confirmPassword && confirmPassword !== newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const input = phone.trim();

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Normalize phone number (remove spaces and hyphens)
    const cleanPhone = input.replace(/[\s\-]/g, "");
    const searchConditions = [
      { phone: cleanPhone },
      { phone: input },
      { email: input.toLowerCase() },
    ];

    let account = await User.findOne({ $or: searchConditions });
    if (!account) {
      account = await Staff.findOne({ $or: searchConditions });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number or email",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  resetPassword,
};