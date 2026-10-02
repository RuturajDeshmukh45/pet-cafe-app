const express = require('express');
const router = express.Router();
const { processPayment, getReceipt } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, processPayment);
router.get('/:id', verifyToken, getReceipt);

module.exports = router;
