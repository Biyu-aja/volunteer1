const { Organization, Event, User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getMyOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findOne({
    where: { user_id: req.user.id },
    include: [{ model: Event }],
  });
  if (!org) throw ApiError.notFound("Profil organisasi tidak ditemukan");
  res.json({ success: true, data: org });
});

const updateMyOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findOne({ where: { user_id: req.user.id } });
  if (!org) throw ApiError.notFound("Profil organisasi tidak ditemukan");

  const { org_name, description, address } = req.body;
  await org.update({ org_name, description, address });

  res.json({ success: true, data: org });
});

const listOrganizations = asyncHandler(async (req, res) => {
  const orgs = await Organization.findAll({ where: { is_verified: true } });
  res.json({ success: true, data: orgs });
});

// GET /api/organizations/admin/all -> semua organisasi (termasuk yang belum diverifikasi), role: admin
const listAllOrganizationsForAdmin = asyncHandler(async (req, res) => {
  const orgs = await Organization.findAll({
    include: [{ model: User, attributes: ["id", "full_name", "email", "phone", "created_at"] }],
    order: [["created_at", "ASC"]],
  });
  res.json({ success: true, data: orgs });
});

// PATCH /api/organizations/:id/verify  { is_verified } -> approve/reject organisasi, role: admin
const setOrganizationVerification = asyncHandler(async (req, res) => {
  const org = await Organization.findByPk(req.params.id);
  if (!org) throw ApiError.notFound("Organisasi tidak ditemukan");

  const { is_verified } = req.body;
  if (typeof is_verified !== "boolean") {
    throw ApiError.badRequest("Field is_verified harus bernilai true/false");
  }

  org.is_verified = is_verified;
  await org.save();

  res.json({ success: true, data: org });
});

module.exports = {
  getMyOrganization,
  updateMyOrganization,
  listOrganizations,
  listAllOrganizationsForAdmin,
  setOrganizationVerification,
};
