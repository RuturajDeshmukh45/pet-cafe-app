require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./src/config/db');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Pet Café Management API',
    engine: db.getActiveEngine(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB and start server
async function startServer() {
  try {
    await db.initDb();
    const server = app.listen(PORT, () => {
      console.log(`🐾 Pet Café Backend Server running on http://localhost:${PORT}`);
      console.log(`📡 Database Engine: ${db.getActiveEngine().toUpperCase()}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use by another running process.`);
        console.error(`👉 Solution: Stop any existing backend server instance or run: npx kill-port ${PORT}\n`);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Fatal: Could not start backend server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
