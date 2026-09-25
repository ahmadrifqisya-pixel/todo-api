const category = require("../models/category.js");
const categoryServices = require("../services/category.service.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");

const createCategory = catchAsync(async (req, res, next) => {
        const { name, description } = req.body;

        if (!name) {
           return next (new AppError ("Name is required", 400));
        }

        const category = await categoryServices.createCategory({
            name,
            description,
            owner: req.user._id,
            ipAddress: req.ip,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    });

const getAllCategories = catchAsync(async (req, res, next) => {
        const categories = await categoryServices.getAllCategories(req.user._id);
    
        res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: categories,
        });
    });

const getCategoryById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const category = await categoryServices.getCategoryById(id);

        if (!category) {
            return next (new AppError("Category not found", 404));
        }

        const isOwner = category.owner.toString() === req.user._id.toString();

        if (!isOwner && req.user.role !== "admin") {
            return next (new AppError("You do not have permission to access this category", 403 ));
        }

        res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category,
        });
    });

const updateCategory = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { name, description } = req.body;

        const existingCategory = await categoryServices.getCategoryById(id);

        if (!existingCategory) {
            return next (new AppError("Category not found", 404));
        }

        const isOwner = existingCategory.owner.toString() === req.user._id.toString();

        if (!isOwner && req.user.role !== "admin") {
            return next (new AppError("You do not have have permission to access this category", 403));
        }

        const updatedCategory = await categoryServices.updateCategory(id, {
            name,
            description,
        });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    });

const deleteCategory = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const existingCategory = await categoryServices.getCategoryById(id);

        if (!existingCategory) {
            return next (new AppError("Category not found", 404));
        }

        const isOwner = existingCategory.owner.toString() === req.user._id.toString();

        if (!isOwner && req.user.role !== "admin") {
            return next (new AppError("You do not have permission to delete this category", 403));
        }

        await categoryServices.deleteCategory(id)

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: existingCategory,
        });
    });

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};