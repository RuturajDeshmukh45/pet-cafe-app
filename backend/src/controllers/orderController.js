const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'ord') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Create new order (with server-side calculated totals and verification)
async function createOrder(req, res) {
  try {
    const { items, reservationId, orderType, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    // Verify all items exist and are Available in database
    const itemIds = items.map(i => i.menuItemId || i.id);
    const placeholders = itemIds.map((_, idx) => `$${idx + 1}`).join(', ');
    const menuItems = await db.query(
      `SELECT id, name, price, status FROM menu_items WHERE id IN (${placeholders})`,
      itemIds
    );

    const itemMap = {};
    menuItems.forEach(mi => { itemMap[mi.id] = mi; });

    let calculatedTotal = 0;
    const verifiedOrderItems = [];

    for (const reqItem of items) {
      const id = reqItem.menuItemId || reqItem.id;
      const found = itemMap[id];

      if (!found) {
        return res.status(400).json({ success: false, message: `Menu item (${id}) is invalid or does not exist.` });
      }

      if (found.status !== 'Available') {
        return res.status(400).json({
          success: false,
          message: `"${found.name}" is currently sold out and unavailable for ordering.`
        });
      }

      const qty = parseInt(reqItem.quantity || 1, 10);
      if (qty <= 0) continue;

      const unitPrice = parseFloat(found.price);
      const subtotal = Math.round(unitPrice * qty * 100) / 100;
      calculatedTotal += subtotal;

      verifiedOrderItems.push({
        menuItemId: id,
        name: found.name,
        quantity: qty,
        unitPrice,
        subtotal
      });
    }

    if (verifiedOrderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid quantities provided.' });
    }

    // Add 8% tax / service
    const taxRate = 0.08;
    const taxAmount = Math.round(calculatedTotal * taxRate * 100) / 100;
    const grandTotal = Math.round((calculatedTotal + taxAmount) * 100) / 100;

    const orderId = generateId('ord');
    await db.query(
      `INSERT INTO orders (id, user_id, reservation_id, total_amount, status, order_type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, userId, reservationId || null, grandTotal, 'Pending', orderType || 'Dine-In']
    );

    // Insert order items
    for (const item of verifiedOrderItems) {
      const oiId = generateId('oi');
      await db.query(
        `INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [oiId, orderId, item.menuItemId, item.quantity, item.unitPrice, item.subtotal]
      );
    }

    // Create payment entry
    const paymentId = generateId('pay');
    const method = paymentMethod || 'Online (Card)';
    const txnRef = `TXN_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await db.query(
      `INSERT INTO payments (id, order_id, reservation_id, amount, method, status, transaction_ref)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [paymentId, orderId, reservationId || null, grandTotal, method, 'Completed', txnRef]
    );

    await logAudit(userId, 'CREATE_ORDER', 'Order', orderId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! The baristas are on it.',
      order: {
        id: orderId,
        totalAmount: grandTotal,
        subtotal: calculatedTotal,
        tax: taxAmount,
        status: 'Pending',
        orderType: orderType || 'Dine-In',
        items: verifiedOrderItems,
        payment: {
          id: paymentId,
          method,
          transactionRef: txnRef,
          amount: grandTotal,
          status: 'Completed'
        }
      }
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process order.' });
  }
}

// Get user orders
async function getUserOrders(req, res) {
  try {
    const orders = await db.query(
      `SELECT o.*, p.method as payment_method, p.transaction_ref
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    for (const order of orders) {
      const items = await db.query(
        `SELECT oi.*, mi.name as item_name, mi.image_url, mi.category
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = items;
    }

    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user orders.' });
  }
}

// Get all orders (Staff / Kitchen / Barista queue)
async function getAllOrders(req, res) {
  try {
    const { status } = req.query;

    let sql = `
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
             p.method as payment_method, p.transaction_ref
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND o.status = $1';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC';

    const orders = await db.query(sql, params);

    for (const order of orders) {
      const items = await db.query(
        `SELECT oi.*, mi.name as item_name, mi.category
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = items;
    }

    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders queue.' });
  }
}

// Update order status (Pending -> Preparing -> Ready -> Served -> Cancelled)
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition.' });
    }

    const order = await db.getOne('SELECT id, status FROM orders WHERE id = $1', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
    await logAudit(req.user.id, `ORDER_STATUS_${status.toUpperCase()}`, 'Order', orderId);

    return res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      status
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
