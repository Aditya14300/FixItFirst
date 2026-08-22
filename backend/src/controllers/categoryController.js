const Category = require("../models/Category");

// Add Main Category
const addCategory = async (req, res) => {
  try {
    const { name, description, icon, image, bookingCount } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description: description || "",
      icon: icon || "",
      image: image || "",
      bookingCount: Number(bookingCount) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Main Categories (sorted by bookingCount descending)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ bookingCount: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCategory,
  getCategories,
};