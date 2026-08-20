const express = require("express");
const {
  getMyOrganization, updateMyOrganization, listOrganizations,
} = require("../controllers/organizationController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listOrganizations);
router.get("/me", authenticate, authorize("organization"), getMyOrganization);
router.put("/me", authenticate, authorize("organization"), updateMyOrganization);

module.exports = router;
