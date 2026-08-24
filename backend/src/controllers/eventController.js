const { Op } = require("sequelize");
const { sequelize, Event, Category, Registration, User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/events?search=&category_id=&status=
const listEvents = asyncHandler(async (req, res) => {
  const { search, category_id, status } = req.query;

  const where = {};
  if (status) where.status = status;
  if (category_id) where.category_id = category_id;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } },
    ];
  }

  const events = await Event.findAll({
    where,
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM registrations AS r
            WHERE r.event_id = "event"."id" AND r.status = 'approved'
          )`),
          'approved_count'
        ]
      ]
    },
    include: [
      { model: Category, attributes: ["id", "name"] },
    ],
    order: [["event_date", "ASC"]],
  });

  res.json({ success: true, data: events });
});

// GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    include: [
      { model: Category, attributes: ["id", "name"] },
    ],
  });
  if (!event) throw ApiError.notFound("Event tidak ditemukan");

  const approvedCount = await Registration.count({
    where: { event_id: event.id, status: "approved" },
  });

  res.json({
    success: true,
    data: {
      ...event.toJSON(),
      approved_count: approvedCount,
      remaining_quota: event.remainingQuota(approvedCount),
    },
  });
});

// POST /api/events (role: admin)
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, location, quota, category_id, event_date, start_time, end_time } = req.body;

  if (!title || !description || !location || !event_date) {
    throw ApiError.badRequest("Data event belum lengkap");
  }

  const event = await Event.create({
    category_id,
    title,
    description,
    location,
    quota,
    event_date,
    start_time,
    end_time,
  });

  res.status(201).json({ success: true, data: event });
});

// PUT /api/events/:id (role: admin)
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) throw ApiError.notFound("Event tidak ditemukan");

  await event.update(req.body);
  res.json({ success: true, data: event });
});

// DELETE /api/events/:id (role: admin)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) throw ApiError.notFound("Event tidak ditemukan");

  await event.destroy();
  res.json({ success: true, message: "Event berhasil dihapus" });
});

// GET /api/events/stats/popular
const popularEvents = asyncHandler(async (req, res) => {
  const [results] = await sequelize.query(`
    SELECT e.id, e.title, e.quota, e.location, e.event_date,
           c.name AS category_name,
           COUNT(r.id) AS total_pendaftar,
           (e.quota - COUNT(r.id)) AS sisa_kuota
    FROM event e
    LEFT JOIN registrations r ON r.event_id = e.id AND r.status IN ('pending','approved')
    LEFT JOIN categories c ON e.category_id = c.id
    GROUP BY e.id, e.title, e.quota, e.location, e.event_date, c.name
    ORDER BY total_pendaftar DESC
    LIMIT 5
  `);

  res.json({ success: true, data: results });
});

const publicStats = asyncHandler(async (req, res) => {
  const volunteerCount = await User.count({ where: { role: "volunteer" } });
  
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const startStr = formatDate(startOfMonth);
  const endStr = formatDate(endOfMonth);

  const eventThisMonthCount = await Event.count({
    where: {
      event_date: {
        [Op.between]: [startStr, endStr],
      },
    },
  });

  const totalEventCount = await Event.count();

  res.json({
    success: true,
    data: {
      volunteers: volunteerCount,
      eventsThisMonth: eventThisMonthCount,
      totalEvents: totalEventCount,
      satisfactionRate: 96,
    },
  });
});

module.exports = {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  popularEvents,
  publicStats,
};