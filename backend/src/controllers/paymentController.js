const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'pay') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Process a simulated payment
async function processPayment(req, res) {
  try {
    const { orderId, reservationId, amount, method, cardNumber, cardExpiry } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const payMethod = method || 'Online (Card)';
    let txnRef = `TXN_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Validate dummy card if online payment
    if (payMethod.includes('Card') || payMethod.includes('Online')) {
      if (cardNumber && cardNumber.replace(/\s+/g, '').length < 12) {
        return res.status(400).json({ success: false, message: 'Please provide a valid card number.' });
      }
    }

    const paymentId = generateId('pay');
    await db.query(
      `INSERT INTO payments (id, order_id, reservation_id, amount, method, status, transaction_ref)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [paymentId, orderId || null, reservationId || null, parseFloat(amount), payMethod, 'Completed', txnRef]
    );

    // If order was associated, update order status to Preparing
    if (orderId) {
      await db.query("UPDATE orders SET status = 'Preparing' WHERE id = $1 AND status = 'Pending'", [orderId]);
    }

    await logAudit(userId, 'PROCESS_PAYMENT', 'Payment', paymentId);

    return res.status(201).json({
      success: true,
      message: 'Payment verified and recorded successfully!',
      payment: {
        id: paymentId,
        orderId,
        reservationId,
        amount: parseFloat(amount),
        method: payMethod,
        status: 'Completed',
        transactionRef: txnRef,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Payment processing error:', err);
    return res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
}

// Get receipt for order or reservation
async function getReceipt(req, res) {
  try {
    const payment = await db.getOne('SELECT * FROM payments WHERE id = $1 OR transaction_ref = $1', [req.params.id]);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }
    return res.json({ success: true, payment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve receipt.' });
  }
}

module.exports = {
  processPayment,
  getReceipt
};
