const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', verifyAdmin, createRoom);
router.put('/:id', verifyAdmin, updateRoom);
router.delete('/:id', verifyAdmin, deleteRoom);

module.exports = router;