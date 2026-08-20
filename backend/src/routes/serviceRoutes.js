const express = require("express");

const router = express.Router();

const {
  addService,
  getServices,
  getServicesByCategory,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/", protect, adminOnly, addService);

router.get("/", getServices);

router.get("/category/:categoryId", getServicesByCategory);

router.put("/:id", protect, adminOnly, updateService);

router.delete("/:id", protect, adminOnly, deleteService);

module.exports = router;