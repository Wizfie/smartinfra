const prisma = require('../config/prisma');

/**
 * Middleware Otentikasi: Verifikasi token Bearer & lampirkan data user ke req.user
 */
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak disediakan.' });
    }

    const token = authHeader.split(' ')[1];
    // Format token: token_<userId>_<timestamp>
    const parts = token.split('_');
    const userId = parseInt(parts[1], 10);

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ success: false, message: 'Format token otentikasi tidak valid.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Pengguna tidak ditemukan di sistem.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Kegagalan verifikasi otentikasi.' });
  }
};

/**
 * Middleware Otorisasi: Hanya izinkan role yang terdaftar di allowedRoles
 * @param {...string} allowedRoles - Role yang diizinkan (e.g. 'admin', 'sales')
 */
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Fitur ini memerlukan otorisasi [${allowedRoles.join(', ')}].`
      });
    }
    next();
  };
};
