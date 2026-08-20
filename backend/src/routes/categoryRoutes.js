const express = require("express");

const router = express.Router();

const {
    addCategory,
    getCategories
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Public
router.get("/", getCategories);

// Admin Only
router.post("/", protect, adminOnly, addCategory);

module.exports = router;