const { Organization, Event } = require("../models");
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

module.exports = { getMyOrganization, updateMyOrganization, listOrganizations };
