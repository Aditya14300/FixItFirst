const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  resetPassword
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/profile", getProfile);

module.exports = router;