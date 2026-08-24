const express = require("express");
const {
  getMyOrganization, updateMyOrganization, listOrganizations,
  listAllOrganizationsForAdmin, setOrganizationVerification,
} = require("../controllers/organizationController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listOrganizations);
router.get("/me", authenticate, authorize("organization"), getMyOrganization);
router.put("/me", authenticate, authorize("organization"), updateMyOrganization);

// Khusus admin: lihat semua organisasi (termasuk yang belum diverifikasi) & approve/reject
router.get("/admin/all", authenticate, authorize("admin"), listAllOrganizationsForAdmin);
router.patch("/:id/verify", authenticate, authorize("admin"), setOrganizationVerification);

module.exports = router;
