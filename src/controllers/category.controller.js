const categoryServices = require("../services/category.services");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new AppError("Name is required", 400));
  }

  const category = await categoryServices.createCategory({
    name,
    description,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: [],
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};