const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'rev') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Get approved reviews for public / customer viewing
async function getApprovedReviews(req, res) {
  try {
    const reviews = await db.query(
      `SELECT r.*, u.name as customer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'Approved'
       ORDER BY r.created_at DESC`
    );

    return res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load reviews.' });
  }
}

// Get all reviews (Admin view for moderation)
async function getAllReviews(req, res) {
  try {
    const reviews = await db.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    return res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load all reviews.' });
  }
}

// Submit a new review (Customer)
async function submitReview(req, res) {
  try {
    const { rating, comment, reservationId } = req.body;
    const userId = req.user.id;

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please write at least a few words for your review.' });
    }

    const reviewId = generateId('rev');
    await db.query(
      `INSERT INTO reviews (id, user_id, reservation_id, rating, comment, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reviewId, userId, reservationId || null, numRating, comment.trim(), 'Approved']
    );

    await logAudit(userId, 'SUBMIT_REVIEW', 'Review', reviewId);

    const review = await db.getOne(
      `SELECT r.*, u.name as customer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [reviewId]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review helps our furry friends and café thrive.',
      review
    });
  } catch (err) {
    console.error('Submit review error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}

// Moderate review status (Admin: Approved, Hidden, Pending)
async function moderateReview(req, res) {
  try {
    const { status } = req.body;
    const reviewId = req.params.id;

    if (!['Approved', 'Hidden', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid moderation status.' });
    }

    await db.query('UPDATE reviews SET status = $1 WHERE id = $2', [status, reviewId]);
    await logAudit(req.user.id, `MODERATE_REVIEW_${status.toUpperCase()}`, 'Review', reviewId);

    return res.json({ success: true, message: `Review status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update review status.' });
  }
}

module.exports = {
  getApprovedReviews,
  getAllReviews,
  submitReview,
  moderateReview
};
