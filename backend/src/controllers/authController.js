const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../middleware/authMiddleware');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'usr') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Register User with Role
async function register(req, res) {
  try {
    const { name, email, phone, password, roleName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check email uniqueness
    const existing = await db.getOne('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Find requested role or default to Customer
    const targetRoleName = ['Admin', 'Staff', 'Customer'].includes(roleName) ? roleName : 'Customer';
    const roleRecord = await db.getOne("SELECT id, name FROM roles WHERE name = $1", [targetRoleName]);
    if (!roleRecord) {
      return res.status(500).json({ success: false, message: `Role "${targetRoleName}" not found in system.` });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId('usr');

    await db.query(
      `INSERT INTO users (id, name, email, phone, password_hash, role_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : null, passwordHash, roleRecord.id, 'Active']
    );

    const token = generateToken({ userId, email: email.trim().toLowerCase() });

    await logAudit(userId, `USER_REGISTER_${targetRoleName.toUpperCase()}`, 'User', userId);

    return res.status(201).json({
      success: true,
      message: `Account created successfully with ${targetRoleName} role! Welcome to Pet Café.`,
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        roleName: targetRoleName,
        status: 'Active'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// Login User
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await db.getOne(
      `SELECT u.id, u.name, u.email, u.phone, u.password_hash, u.status, u.role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE LOWER(u.email) = LOWER($1)`,
      [email.trim()]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Your account is currently inactive. Please reach out to staff.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleName: user.role_name || 'Customer',
        status: user.status
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// Get Profile of Current User
async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching user details.' });
  }
}

// Update Profile
async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name cannot be blank.' });
    }

    await db.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
      [name.trim(), phone ? phone.trim() : null, req.user.id]
    );

    await logAudit(req.user.id, 'PROFILE_UPDATE', 'User', req.user.id);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        ...req.user,
        name: name.trim(),
        phone: phone ? phone.trim() : null
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
