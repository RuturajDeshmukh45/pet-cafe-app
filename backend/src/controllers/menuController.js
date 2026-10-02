const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'item') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Get all menu items
async function getMenuItems(req, res) {
  try {
    const { category, status, search } = req.query;

    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (category && category !== 'All') {
      sql += ` AND LOWER(category) = LOWER($${pIdx++})`;
      params.push(category);
    }

    if (status && status !== 'All') {
      sql += ` AND LOWER(status) = LOWER($${pIdx++})`;
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(name) LIKE LOWER($${pIdx}) OR LOWER(description) LIKE LOWER($${pIdx}))`;
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    sql += ' ORDER BY category ASC, name ASC';

    const items = await db.query(sql, params);
    return res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving menu.' });
  }
}

// Get single item
async function getMenuItemById(req, res) {
  try {
    const item = await db.getOne('SELECT * FROM menu_items WHERE id = $1', [req.params.id]);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving menu item.' });
  }
}

// Create menu item (Staff / Admin)
async function createMenuItem(req, res) {
  try {
    const { name, category, description, price, imageUrl, status } = req.body;

    if (!name || !category || !description || price === undefined || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, description, price, and image URL are required.'
      });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
    }

    const itemId = generateId('item');
    await db.query(
      `INSERT INTO menu_items (id, name, category, description, price, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [itemId, name.trim(), category.trim(), description.trim(), numPrice, imageUrl.trim(), status || 'Available']
    );

    await logAudit(req.user.id, 'CREATE_MENU_ITEM', 'MenuItem', itemId);

    const newItem = await db.getOne('SELECT * FROM menu_items WHERE id = $1', [itemId]);
    return res.status(201).json({
      success: true,
      message: `${name} has been added to the café menu!`,
      item: newItem
    });
  } catch (err) {
    console.error('Error creating menu item:', err);
    return res.status(500).json({ success: false, message: 'Failed to create menu item.' });
  }
}

// Update menu item
async function updateMenuItem(req, res) {
  try {
    const { name, category, description, price, imageUrl, status } = req.body;
    const itemId = req.params.id;

    const existing = await db.getOne('SELECT id FROM menu_items WHERE id = $1', [itemId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
    }

    await db.query(
      `UPDATE menu_items
       SET name = $1, category = $2, description = $3, price = $4, image_url = $5, status = $6
       WHERE id = $7`,
      [name, category, description, numPrice, imageUrl, status, itemId]
    );

    await logAudit(req.user.id, 'UPDATE_MENU_ITEM', 'MenuItem', itemId);

    const updated = await db.getOne('SELECT * FROM menu_items WHERE id = $1', [itemId]);
    return res.json({ success: true, message: 'Menu item updated successfully.', item: updated });
  } catch (err) {
    console.error('Error updating menu item:', err);
    return res.status(500).json({ success: false, message: 'Failed to update menu item.' });
  }
}

// Toggle availability
async function toggleItemAvailability(req, res) {
  try {
    const itemId = req.params.id;
    const item = await db.getOne('SELECT id, status, name FROM menu_items WHERE id = $1', [itemId]);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const newStatus = item.status === 'Available' ? 'Unavailable' : 'Available';
    await db.query('UPDATE menu_items SET status = $1 WHERE id = $2', [newStatus, itemId]);
    await logAudit(req.user.id, `TOGGLE_MENU_${newStatus.toUpperCase()}`, 'MenuItem', itemId);

    return res.json({
      success: true,
      message: `${item.name} is now marked as ${newStatus}.`,
      status: newStatus
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update availability.' });
  }
}

// Delete menu item (Admin only)
async function deleteMenuItem(req, res) {
  try {
    const itemId = req.params.id;
    const existing = await db.getOne('SELECT name FROM menu_items WHERE id = $1', [itemId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    await db.query('DELETE FROM menu_items WHERE id = $1', [itemId]);
    await logAudit(req.user.id, 'DELETE_MENU_ITEM', 'MenuItem', itemId);

    return res.json({ success: true, message: `Menu item ${existing.name} removed successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete menu item.' });
  }
}

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleItemAvailability,
  deleteMenuItem
};
