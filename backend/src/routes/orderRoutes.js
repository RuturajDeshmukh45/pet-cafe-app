const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { verifyToken, requireStaffOrAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getUserOrders);
router.get('/', verifyToken, requireStaffOrAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, requireStaffOrAdmin, updateOrderStatus);

module.exports = router;
