const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  updatePetStatus,
  deletePet
} = require('../controllers/petController');
const { verifyToken, requireStaffOrAdmin, requireAdmin } = require('../middleware/authMiddleware');

// Optional auth for public routes (to expose staff care notes if logged in as staff)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getPets);
router.get('/:id', optionalAuth, getPetById);
router.post('/', verifyToken, requireStaffOrAdmin, createPet);
router.put('/:id', verifyToken, requireStaffOrAdmin, updatePet);
router.patch('/:id/status', verifyToken, requireStaffOrAdmin, updatePetStatus);
router.delete('/:id', verifyToken, requireAdmin, deletePet);

module.exports = router;
