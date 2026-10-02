const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// Get high-level admin dashboard statistics
async function getDashboardStats(req, res) {
  try {
    const totalUsersRow = await db.getOne('SELECT COUNT(*) as count FROM users');
    const totalPetsRow = await db.getOne('SELECT COUNT(*) as count FROM pets');
    const activePetsRow = await db.getOne("SELECT COUNT(*) as count FROM pets WHERE status = 'Available'");
    const totalMenuItemsRow = await db.getOne('SELECT COUNT(*) as count FROM menu_items');
    const totalReservationsRow = await db.getOne('SELECT COUNT(*) as count FROM reservations');
    const totalOrdersRow = await db.getOne('SELECT COUNT(*) as count FROM orders');
    const totalRevenueRow = await db.getOne("SELECT SUM(amount) as sum FROM payments WHERE status = 'Completed'");

    // Recent 5 reservations
    const recentReservations = await db.query(
      `SELECT r.*, u.name as customer_name
       FROM reservations r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC
       LIMIT 5`
    );

    // Recent 5 orders
    const recentOrders = await db.query(
      `SELECT o.*, u.name as customer_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    // Operational report summary by category
    const categoryStats = await db.query(
      `SELECT category, COUNT(*) as item_count
       FROM menu_items
       GROUP BY category`
    );

    // Pet species breakdown
    const speciesStats = await db.query(
      `SELECT species, COUNT(*) as pet_count
       FROM pets
       GROUP BY species`
    );

    return res.json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsersRow?.count || 0, 10),
        totalPets: parseInt(totalPetsRow?.count || 0, 10),
        activePets: parseInt(activePetsRow?.count || 0, 10),
        totalMenuItems: parseInt(totalMenuItemsRow?.count || 0, 10),
        totalReservations: parseInt(totalReservationsRow?.count || 0, 10),
        totalOrders: parseInt(totalOrdersRow?.count || 0, 10),
        totalRevenue: parseFloat(totalRevenueRow?.sum || 0).toFixed(2),
        recentReservations,
        recentOrders,
        categoryStats,
        speciesStats
      }
    });
  } catch (err) {
    console.error('Error in admin dashboard stats:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate admin statistics.' });
  }
}

// User Management: List all users
async function getUsers(req, res) {
  try {
    const users = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
}

// User Management: Update role or status
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { roleName, status } = req.body;

    const user = await db.getOne('SELECT id, name FROM users WHERE id = $1', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (roleName) {
      const role = await db.getOne('SELECT id FROM roles WHERE name = $1', [roleName]);
      if (!role) {
        return res.status(400).json({ success: false, message: 'Invalid role.' });
      }
      await db.query('UPDATE users SET role_id = $1 WHERE id = $2', [role.id, userId]);
      await logAudit(req.user.id, `UPDATE_USER_ROLE_${roleName.toUpperCase()}`, 'User', userId);
    }

    if (status) {
      if (!['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status.' });
      }
      await db.query('UPDATE users SET status = $1 WHERE id = $2', [status, userId]);
      await logAudit(req.user.id, `UPDATE_USER_STATUS_${status.toUpperCase()}`, 'User', userId);
    }

    return res.json({ success: true, message: `User ${user.name} updated successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
}

// Audit Logs
async function getAuditLogs(req, res) {
  try {
    const logs = await db.query(
      `SELECT a.*, u.name as user_name, u.email as user_email
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.timestamp DESC
       LIMIT 50`
    );
    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  getAuditLogs
};
