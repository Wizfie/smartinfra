require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static images route
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SmartInfra Cloud & AI Infrastructure Decision API'
  });
});

// Register API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` SmartInfra Express API Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` SPK Recommend: http://localhost:${PORT}/api/spk/recommend`);
  console.log(` Infrastructures: http://localhost:${PORT}/api/infrastructures`);
  console.log(`===============================================`);
});

module.exports = app;
