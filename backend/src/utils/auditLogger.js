const db = require('../config/db');

function generateId(prefix = 'audit') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

async function logAudit(userId, action, entityType, entityId) {
  try {
    const id = generateId('audit');
    await db.query(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, userId || null, action, entityType, entityId ? String(entityId) : null]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAudit };
