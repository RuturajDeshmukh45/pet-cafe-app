const db = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

function generateId(prefix = 'pet') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Get all pets with optional filtering & search
async function getPets(req, res) {
  try {
    const { species, status, search } = req.query;

    let sql = 'SELECT * FROM pets WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (species && species !== 'All') {
      sql += ` AND LOWER(species) = LOWER($${pIdx++})`;
      params.push(species);
    }

    if (status && status !== 'All') {
      sql += ` AND LOWER(status) = LOWER($${pIdx++})`;
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(name) LIKE LOWER($${pIdx}) OR LOWER(breed) LIKE LOWER($${pIdx}) OR LOWER(description) LIKE LOWER($${pIdx}))`;
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    sql += ' ORDER BY created_at DESC';

    const pets = await db.query(sql, params);

    // If user is not staff/admin, sanitize care_notes if private
    const isStaffOrAdmin = req.user && ['Admin', 'Staff'].includes(req.user.roleName);
    const sanitized = pets.map(pet => ({
      ...pet,
      care_notes: isStaffOrAdmin ? pet.care_notes : undefined
    }));

    return res.json({ success: true, count: sanitized.length, pets: sanitized });
  } catch (err) {
    console.error('Error fetching pets:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving pets.' });
  }
}

// Get single pet by ID
async function getPetById(req, res) {
  try {
    const pet = await db.getOne('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found.' });
    }

    const isStaffOrAdmin = req.user && ['Admin', 'Staff'].includes(req.user.roleName);
    return res.json({
      success: true,
      pet: {
        ...pet,
        care_notes: isStaffOrAdmin ? pet.care_notes : undefined
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving pet details.' });
  }
}

// Create new pet (Staff / Admin)
async function createPet(req, res) {
  try {
    const { name, species, breed, age, description, photoUrl, status, careNotes, restrictions } = req.body;

    if (!name || !species || !breed || !description || !photoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Name, species, breed, description, and photo URL are required.'
      });
    }

    const petId = generateId('pet');
    await db.query(
      `INSERT INTO pets (id, name, species, breed, age, description, photo_url, status, care_notes, restrictions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        petId,
        name.trim(),
        species.trim(),
        breed.trim(),
        parseInt(age || 1, 10),
        description.trim(),
        photoUrl.trim(),
        status || 'Available',
        careNotes || '',
        restrictions || ''
      ]
    );

    await logAudit(req.user.id, 'CREATE_PET', 'Pet', petId);

    const newPet = await db.getOne('SELECT * FROM pets WHERE id = $1', [petId]);
    return res.status(201).json({
      success: true,
      message: `${name} has been added to our furry family!`,
      pet: newPet
    });
  } catch (err) {
    console.error('Error creating pet:', err);
    return res.status(500).json({ success: false, message: 'Failed to create pet profile.' });
  }
}

// Update pet
async function updatePet(req, res) {
  try {
    const { name, species, breed, age, description, photoUrl, status, careNotes, restrictions } = req.body;
    const petId = req.params.id;

    const existing = await db.getOne('SELECT id, name FROM pets WHERE id = $1', [petId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pet not found.' });
    }

    await db.query(
      `UPDATE pets
       SET name = $1, species = $2, breed = $3, age = $4, description = $5,
           photo_url = $6, status = $7, care_notes = $8, restrictions = $9
       WHERE id = $10`,
      [
        name,
        species,
        breed,
        parseInt(age || 1, 10),
        description,
        photoUrl,
        status,
        careNotes,
        restrictions,
        petId
      ]
    );

    await logAudit(req.user.id, 'UPDATE_PET', 'Pet', petId);

    const updated = await db.getOne('SELECT * FROM pets WHERE id = $1', [petId]);
    return res.json({
      success: true,
      message: 'Pet profile updated successfully.',
      pet: updated
    });
  } catch (err) {
    console.error('Error updating pet:', err);
    return res.status(500).json({ success: false, message: 'Failed to update pet profile.' });
  }
}

// Update pet status (Available, Resting, Playing, Unavailable)
async function updatePetStatus(req, res) {
  try {
    const { status } = req.body;
    const petId = req.params.id;

    if (!['Available', 'Resting', 'Playing', 'Unavailable'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    await db.query('UPDATE pets SET status = $1 WHERE id = $2', [status, petId]);
    await logAudit(req.user.id, `UPDATE_PET_STATUS_${status.toUpperCase()}`, 'Pet', petId);

    return res.json({ success: true, message: `Pet status changed to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update pet status.' });
  }
}

// Delete pet (Admin only)
async function deletePet(req, res) {
  try {
    const petId = req.params.id;
    const existing = await db.getOne('SELECT name FROM pets WHERE id = $1', [petId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pet not found.' });
    }

    await db.query('DELETE FROM pets WHERE id = $1', [petId]);
    await logAudit(req.user.id, 'DELETE_PET', 'Pet', petId);

    return res.json({ success: true, message: `Pet ${existing.name} removed successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete pet.' });
  }
}

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  updatePetStatus,
  deletePet
};
