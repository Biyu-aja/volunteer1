const { Category } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json({ success: true, data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw ApiError.badRequest("Nama kategori wajib diisi");

  const category = await Category.create({ name });
  res.status(201).json({ success: true, data: category });
});

module.exports = { listCategories, createCategory };
