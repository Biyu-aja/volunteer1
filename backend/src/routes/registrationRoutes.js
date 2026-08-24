const express = require("express");
const {
  applyToEvent, myRegistrations, listByEvent, updateStatus,
} = require("../controllers/registrationController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, authorize("volunteer"), applyToEvent);
router.get("/me", authenticate, authorize("volunteer"), myRegistrations);
router.get("/event/:eventId", authenticate, authorize("admin"), listByEvent);
router.patch("/:id/status", authenticate, authorize("admin"), updateStatus);

module.exports = router;
