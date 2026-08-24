const { Event, Registration, User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/registrations  { event_id }  (role: volunteer)
const applyToEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.body;
  const event = await Event.findByPk(event_id);
  if (!event) throw ApiError.notFound("Event tidak ditemukan");

  const today = new Date().toISOString().split("T")[0];
  if (event.event_date < today) {
    throw ApiError.badRequest("Kegiatan ini sudah berlalu dan tidak menerima pendaftaran baru");
  }

  const already = await Registration.findOne({
    where: { event_id, user_id: req.user.id },
  });
  if (already) throw ApiError.badRequest("Anda sudah mendaftar pada event ini");

  const approvedCount = await Registration.count({
    where: { event_id, status: "approved" },
  });
  if (event.isFull(approvedCount)) {
    throw ApiError.badRequest("Kuota event sudah penuh");
  }

  const registration = await Registration.create({
    event_id,
    user_id: req.user.id,
  });

  res.status(201).json({ success: true, data: registration });
});

// GET /api/registrations/me  -> riwayat pendaftaran volunteer yang login
const myRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.findAll({
    where: { user_id: req.user.id },
    include: [{ model: Event, as: "event" }], // Gunakan alias eksplisit jika diset di Sequelize
    order: [["applied_at", "DESC"]],
  });
  res.json({ success: true, data: registrations });
});

// GET /api/registrations/event/:eventId -> daftar pendaftar suatu event (role: admin)
const listByEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  if (!event) throw ApiError.notFound("Event tidak ditemukan");

  const registrations = await Registration.findAll({
    where: { event_id: req.params.eventId },
    include: [{ model: User, attributes: ["id", "full_name", "email", "phone"] }],
    order: [["applied_at", "ASC"]],
  });

  res.json({ success: true, data: registrations });
});

// PATCH /api/registrations/:id/status  { status } (role: admin)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "approved", "rejected", "attended"];
  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest("Status tidak valid");
  }
  const registration = await Registration.findByPk(req.params.id, { 
    include: [{ model: Event, as: "event" }] 
  });
  if (!registration) throw ApiError.notFound("Data pendaftaran tidak ditemukan");

  // Mendukung instance nama properti 'event' maupun 'Event'
  const event = registration.event || registration.Event;
  if (!event) throw ApiError.badRequest("Data kegiatan terasosiasi tidak ditemukan");

  registration.status = status;
  await registration.save();

  res.json({ success: true, data: registration });
});

module.exports = { applyToEvent, myRegistrations, listByEvent, updateStatus };