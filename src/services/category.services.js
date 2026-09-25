const mongoose = require("mongoose");
const categoryDb = require("../config/category.DB");

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
        { timestamps: true }
      ),
      collectionName
    );

  const category = new DynamicCategoryModel({
    name: data.name,
    description: data.description,
    owner: data.owner,
  });

  const savedCategory = await category.save();

  return savedCategory;
}

module.exports = {
  createCategory,
};