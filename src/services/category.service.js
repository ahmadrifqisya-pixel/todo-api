const { logActivity } = require("./log.service.js");
const mongoose = require("mongoose");
const categoryDb = require("../config/category.DB.js");
const Category = require("../models/category.js");

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
        data.ipAddress || "127.0.0.1"
    );

    return savedCategory;
}

async function getAllCategories(ownerId) {
    const collections = await categoryDb.db.listCollections().toArray();
    let allCategories = [];
    
    for (let col of collections) {
        const collectionName = col.name;
        if (collectionName.startsWith('system.')) continue;
        
        const DynamicModel = categoryDb.models[collectionName] || categoryDb.model(
            collectionName, 
            new mongoose.Schema({ name: String, description: String, owner: mongoose.Schema.Types.ObjectId }, { timestamp: true }),
            collectionName
        );
        
        const cats = await DynamicModel.find({ owner: ownerId }).sort({ createdAt: -1 });
        allCategories.push(...cats);
    }
    
    return allCategories;
}

async function getCategoryById(id) {
    const collections = await categoryDb.db.listCollections().toArray();
    
    for (let col of collections) {
        const collectionName = col.name;
        if (collectionName.startsWith('system.')) continue;
        
        const DynamicModel = categoryDb.models[collectionName] || categoryDb.model(
            collectionName, 
            new mongoose.Schema({}, { strict: false }),
            collectionName
        );
        
        const found = await DynamicModel.findById(id);
        if (found) return found;
    }
    
    return null;
}

async function updateCategory(id, data) {
    const collections = await categoryDb.db.listCollections().toArray();
    
    for (let col of collections) {
        const collectionName = col.name;
        if (collectionName.startsWith('system.')) continue;
        
        const DynamicModel = categoryDb.models[collectionName] || categoryDb.model(
            collectionName, 
            new mongoose.Schema({}, { strict: false }),
            collectionName
        );
        
        const updated = await DynamicModel.findByIdAndUpdate(
            id,
            {
                name: data.name,
                description: data.description,
            },
            { new: true, runValidators: true }
        );
        
        if (updated) return updated;
    }
    
    return null;
}

async function deleteCategory(id) {
    const collections = await categoryDb.db.listCollections().toArray();
    
    for (let col of collections) {
        const collectionName = col.name;
        if (collectionName.startsWith('system.')) continue;
        
        const DynamicModel = categoryDb.models[collectionName] || categoryDb.model(
            collectionName, 
            new mongoose.Schema({}, { strict: false }),
            collectionName
        );
        
        const deleted = await DynamicModel.findByIdAndDelete(id);
        if (deleted) return deleted;
    }
    
    return null;
}

async function getCategorySummaryStats() {
    const collections = await categoryDb.db.listCollections().toArray();
    let totalCategories = 0;
    
    for (let col of collections) {
        const collectionName = col.name;
        if (collectionName.startsWith('system.')) continue;
        
        const DynamicModel = categoryDb.models[collectionName] || categoryDb.model(
            collectionName, 
            new mongoose.Schema({}, { strict: false }),
            collectionName
        );
        
        const count = await DynamicModel.countDocuments();
        totalCategories += count;
    }
    
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