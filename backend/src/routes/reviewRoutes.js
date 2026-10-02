const express = require('express');
const router = express.Router();
const {
  getApprovedReviews,
  getAllReviews,
  submitReview,
  moderateReview
} = require('../controllers/reviewController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getApprovedReviews);
router.get('/all', verifyToken, requireAdmin, getAllReviews);
router.post('/', verifyToken, submitReview);
router.patch('/:id/status', verifyToken, requireAdmin, moderateReview);

module.exports = router;
