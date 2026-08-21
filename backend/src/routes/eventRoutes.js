const express = require("express");
const {
  listEvents, getEventById, createEvent, updateEvent, deleteEvent, popularEvents, publicStats,
} = require("../controllers/eventController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listEvents);
router.get("/stats/popular", popularEvents);
router.get("/stats/public", publicStats);
router.get("/:id", getEventById);
router.post("/", authenticate, authorize("organization"), createEvent);
router.put("/:id", authenticate, authorize("organization"), updateEvent);
router.delete("/:id", authenticate, authorize("organization"), deleteEvent);

module.exports = router;
