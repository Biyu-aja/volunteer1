const express = require("express");
const { listCategories, createCategory } = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listCategories);
router.post("/", authenticate, authorize("admin"), createCategory);

module.exports = router;
