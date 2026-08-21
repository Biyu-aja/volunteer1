const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// Struktur kontrol (percabangan) untuk memverifikasi token JWT dari header Authorization
function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Token tidak ditemukan"));
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT_SECRET belum diset di environment variable (.env)"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(ApiError.unauthorized("Token tidak valid atau kedaluwarsa"));
  }
}

// Higher-order function untuk membatasi akses berdasarkan role
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Anda tidak memiliki akses ke resource ini"));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
