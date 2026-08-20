const Service = require("../models/Service");

const addService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discountPrice,
      duration,
      image,
    } = req.body;

    if (!name || !category || !description || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      discountPrice,
      duration,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getServices = async (req, res) => {
  try {

    const services = await Service.find().populate("category");

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const services = await Service.find({
      category: categoryId,
      isActive: true,
    }).populate("category");

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addService,
  getServices,
  getServicesByCategory,
  updateService,
  deleteService,
};
