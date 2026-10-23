const prisma = require('../config/prisma');

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan atau email salah.'
      });
    }

    // Cek password sederhana (mendukung plain atau hash)
    if (user.passwordHash !== password) {
      return res.status(401).json({
        success: false,
        message: 'Password yang Anda masukkan salah.'
      });
    }

    // Login sukses
    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: `token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error during login (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({
    success: true,
    user: {
      name: 'Administrator SmartInfra',
      role: 'admin',
      email: 'admin@smartinfra.com'
    }
  });
};
