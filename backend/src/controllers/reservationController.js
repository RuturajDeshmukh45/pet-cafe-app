const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'res') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Configured capacity per slot
const MAX_CAPACITY_PER_SLOT = 30;
const STANDARD_SLOTS = [
  '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'
];

// Check slot availability for a specific date
async function checkAvailability(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter (YYYY-MM-DD) is required.' });
    }

    // Query active bookings for that date
    const bookings = await db.query(
      `SELECT start_time, SUM(party_size) as total_guests
       FROM reservations
       WHERE date = $1 AND status IN ('Confirmed', 'Pending')
       GROUP BY start_time`,
      [date]
    );

    const bookedMap = {};
    bookings.forEach(b => {
      bookedMap[b.start_time] = parseInt(b.total_guests || 0, 10);
    });

    const slots = STANDARD_SLOTS.map(time => {
      const booked = bookedMap[time] || 0;
      const remaining = Math.max(0, MAX_CAPACITY_PER_SLOT - booked);
      return {
        time,
        booked,
        remaining,
        available: remaining > 0
      };
    });

    return res.json({
      success: true,
      date,
      maxSlotCapacity: MAX_CAPACITY_PER_SLOT,
      slots
    });
  } catch (err) {
    console.error('Check availability error:', err);
    return res.status(500).json({ success: false, message: 'Failed to check availability.' });
  }
}

// Create a new reservation
async function createReservation(req, res) {
  try {
    const { date, startTime, partySize, notes } = req.body;
    const userId = req.user.id;

    if (!date || !startTime || !partySize) {
      return res.status(400).json({ success: false, message: 'Date, start time, and party size are required.' });
    }

    const guests = parseInt(partySize, 10);
    if (isNaN(guests) || guests < 1 || guests > 12) {
      return res.status(400).json({
        success: false,
        message: 'Party size must be between 1 and 12 guests for standard bookings.'
      });
    }

    // Check capacity
    const currentBooked = await db.getOne(
      `SELECT SUM(party_size) as total_guests
       FROM reservations
       WHERE date = $1 AND start_time = $2 AND status IN ('Confirmed', 'Pending')`,
      [date, startTime]
    );

    const alreadyBooked = parseInt(currentBooked?.total_guests || 0, 10);
    if (alreadyBooked + guests > MAX_CAPACITY_PER_SLOT) {
      return res.status(409).json({
        success: false,
        message: `Sorry, this time slot only has ${Math.max(0, MAX_CAPACITY_PER_SLOT - alreadyBooked)} spot(s) remaining.`
      });
    }

    const resId = generateId('res');
    await db.query(
      `INSERT INTO reservations (id, user_id, date, start_time, party_size, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [resId, userId, date, startTime, guests, 'Confirmed', notes || '']
    );

    await logAudit(userId, 'CREATE_RESERVATION', 'Reservation', resId);

    const reservation = await db.getOne('SELECT * FROM reservations WHERE id = $1', [resId]);

    return res.status(201).json({
      success: true,
      message: `Reservation confirmed for ${guests} guest(s) on ${date} at ${startTime}!`,
      reservation
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    return res.status(500).json({ success: false, message: 'Failed to create reservation.' });
  }
}

// Get user's own reservations
async function getUserReservations(req, res) {
  try {
    const reservations = await db.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1
       ORDER BY r.date DESC, r.start_time DESC`,
      [req.user.id]
    );

    return res.json({ success: true, count: reservations.length, reservations });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user reservations.' });
  }
}

// Get all reservations (Staff / Admin)
async function getAllReservations(req, res) {
  try {
    const { date, status, search } = req.query;

    let sql = `
      SELECT r.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let pIdx = 1;

    if (date) {
      sql += ` AND r.date = $${pIdx++}`;
      params.push(date);
    }

    if (status && status !== 'All') {
      sql += ` AND r.status = $${pIdx++}`;
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(u.name) LIKE LOWER($${pIdx}) OR LOWER(u.email) LIKE LOWER($${pIdx}) OR LOWER(r.notes) LIKE LOWER($${pIdx}))`;
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    sql += ' ORDER BY r.date DESC, r.start_time DESC';

    const reservations = await db.query(sql, params);
    return res.json({ success: true, count: reservations.length, reservations });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reservations.' });
  }
}

// Update reservation status (Confirm, Reject, Cancel, Arrived, Completed)
async function updateReservationStatus(req, res) {
  try {
    const { status } = req.body;
    const resId = req.params.id;

    const allowed = ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Arrived', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid reservation status.' });
    }

    const reservation = await db.getOne('SELECT * FROM reservations WHERE id = $1', [resId]);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    // If customer is requesting cancellation, verify ownership
    const isStaffOrAdmin = ['Admin', 'Staff'].includes(req.user.roleName);
    if (!isStaffOrAdmin && reservation.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this reservation.' });
    }

    await db.query('UPDATE reservations SET status = $1 WHERE id = $2', [status, resId]);
    await logAudit(req.user.id, `UPDATE_RESERVATION_${status.toUpperCase()}`, 'Reservation', resId);

    return res.json({
      success: true,
      message: `Reservation status updated to ${status}.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update reservation status.' });
  }
}

// Cancel reservation (Customer)
async function cancelReservation(req, res) {
  try {
    const resId = req.params.id;
    const reservation = await db.getOne('SELECT * FROM reservations WHERE id = $1', [resId]);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const isStaffOrAdmin = ['Admin', 'Staff'].includes(req.user.roleName);
    if (!isStaffOrAdmin && reservation.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot cancel someone else’s reservation.' });
    }

    await db.query("UPDATE reservations SET status = 'Cancelled' WHERE id = $1", [resId]);
    await logAudit(req.user.id, 'CANCEL_RESERVATION', 'Reservation', resId);

    return res.json({ success: true, message: 'Reservation cancelled successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to cancel reservation.' });
  }
}

module.exports = {
  checkAvailability,
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation
};
