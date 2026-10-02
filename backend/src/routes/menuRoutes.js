const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleItemAvailability,
  deleteMenuItem
} = require('../controllers/menuController');
const { verifyToken, requireStaffOrAdmin, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', verifyToken, requireStaffOrAdmin, createMenuItem);
router.put('/:id', verifyToken, requireStaffOrAdmin, updateMenuItem);
router.patch('/:id/availability', verifyToken, requireStaffOrAdmin, toggleItemAvailability);
router.delete('/:id', verifyToken, requireAdmin, deleteMenuItem);

module.exports = router;
