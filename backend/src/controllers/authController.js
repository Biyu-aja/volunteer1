const jwt = require("jsonwebtoken");
const { User, Organization } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum diset di environment variable (.env)");
  }
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, role, org_name } = req.body;

  if (!full_name || !email || !password) {
    throw ApiError.badRequest("full_name, email, dan password wajib diisi");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw ApiError.badRequest("Email sudah terdaftar");
  }

  // password_hash di-hash otomatis lewat hook beforeCreate pada model User
  const user = await User.create({
    full_name,
    email,
    password_hash: password,
    role: role === "organization" ? "organization" : "volunteer",
  });

  // Jika mendaftar sebagai organisasi, buat entity Organization terkait (relasi 1-1)
  if (user.role === "organization") {
    await Organization.create({
      user_id: user.id,
      org_name: org_name || full_name,
    });
  }

  const token = generateToken(user);
  res.status(201).json({ success: true, data: { user: user.toSafeJSON(), token } });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Email atau password salah");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Email atau password salah");
  }

  const token = generateToken(user);
  res.json({ success: true, data: { user: user.toSafeJSON(), token } });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) throw ApiError.notFound("User tidak ditemukan");
  res.json({ success: true, data: user.toSafeJSON() });
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) throw ApiError.notFound("User tidak ditemukan");

  const { full_name, phone } = req.body;
  await user.update({ full_name, phone });

  res.json({ success: true, data: user.toSafeJSON() });
});

module.exports = { register, login, me, updateProfile };
