const { Event, Registration, Organization, User } = require("../models");
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
    include: [{ model: Event }],
    order: [["applied_at", "DESC"]],
  });
  res.json({ success: true, data: registrations });
});

// GET /api/registrations/event/:eventId -> daftar pendaftar suatu event (role: organization pemilik)
const listByEvent = asyncHandler(async (req, res) => {
  const org = await Organization.findOne({ where: { user_id: req.user.id } });
  const event = await Event.findByPk(req.params.eventId);
  if (!event) throw ApiError.notFound("Event tidak ditemukan");
  if (!org || event.organization_id !== org.id) throw ApiError.forbidden("Bukan pemilik event ini");
  if (!org.is_verified) {
    throw ApiError.forbidden("Organisasi Anda belum diverifikasi oleh admin");
  }

  const registrations = await Registration.findAll({
    where: { event_id: req.params.eventId },
    include: [{ model: User, attributes: ["id", "full_name", "email", "phone"] }],
    order: [["applied_at", "ASC"]],
  });

  res.json({ success: true, data: registrations });
});

// PATCH /api/registrations/:id/status  { status } (role: organization pemilik event)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "approved", "rejected", "attended"];
  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest("Status tidak valid");
  }
  const registration = await Registration.findByPk(req.params.id, { include: [Event] });
  if (!registration) throw ApiError.notFound("Data pendaftaran tidak ditemukan");

  const event = registration.Event || registration.event;
  if (!event) throw ApiError.badRequest("Data kegiatan terasosiasi tidak ditemukan");

  const org = await Organization.findOne({ where: { user_id: req.user.id } });
  if (!org || event.organization_id !== org.id) {
    throw ApiError.forbidden("Anda tidak berwenang mengubah status ini");
  }
  if (!org.is_verified) {
    throw ApiError.forbidden("Organisasi Anda belum diverifikasi oleh admin");
  }

  registration.status = status;
  await registration.save();

  res.json({ success: true, data: registration });
});

module.exports = { applyToEvent, myRegistrations, listByEvent, updateStatus };
