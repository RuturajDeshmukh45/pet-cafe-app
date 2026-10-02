const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation
} = require('../controllers/reservationController');
const { verifyToken, requireStaffOrAdmin } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.post('/', verifyToken, createReservation);
router.get('/my', verifyToken, getUserReservations);
router.get('/', verifyToken, requireStaffOrAdmin, getAllReservations);
router.patch('/:id/status', verifyToken, updateReservationStatus);
router.delete('/:id', verifyToken, cancelReservation);

module.exports = router;
