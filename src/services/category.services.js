const { logActivity } = require("./log.service.js");
const mongoose = require("mongoose");
const categoryDb = require("../config/categoryDb");

async function createCategory(data) {
    console.log("---> DATA DI SERVICE:", data);

    const collectionName = data.name.toLowerCase().trim();

    const DynamicCategoryModel =
      categoryDb.models[collectionName] || 
      categoryDb.model(
        collectionName,
        new mongoose.Schema(
            {
                name: String,
                description: String,
                owner: mongoose.Schema.Types.ObjectId,
            },
            { timestamp: true }
        ),
        collectionName
      );

    const category = new DynamicCategoryModel({
        name: data.name,
        description: data.description,
        owner: data.owner,
    });

    const savedCategory = await category.save();

    console.log("---> IP ADDRESS DIPANGGIL:", data.ipAddress);

    await logActivity(
        data.owner,
        "CREATE_CATEGORY",
        `User membuat kategori baru: ${data.name}`,
        savedCategory._id,
        data.ipAddress || req.ip || "127.0.0.1"
    );

    return savedCategory;
}

async function getAllCategories(ownerId) {
    return await Category.find({ owner: ownerId }).sort({ createdAt: -1 });
}

async function getCategoryById(id) {
    return await Category.findById(id);
}

async function updateCategory(id, data) {
    return await Category.findByIdAndUpdate(
        id,
        {
            name: data.name,
            description: data.description,
        },
        { new: true, runValidators: true }
    );
}

async function deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
}

async function getCategorySummaryStats() {
    const totalCategories = await Category.countDocuments();
    return { totalCategories };
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategorySummaryStats,
};