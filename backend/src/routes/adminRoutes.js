const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUser,
  getAuditLogs
} = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, requireAdmin, getDashboardStats);
router.get('/users', verifyToken, requireAdmin, getUsers);
router.patch('/users/:id', verifyToken, requireAdmin, updateUser);
router.get('/audit-logs', verifyToken, requireAdmin, getAuditLogs);

module.exports = router;
