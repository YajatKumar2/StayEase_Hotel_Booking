const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createReservation,
  getAllReservations,
  getReservationsByEmail,
  modifyReservation,
  cancelReservation
} = require('../controllers/reservationController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.get('/', verifyAdmin, getAllReservations);
router.get('/guest/:email', getReservationsByEmail);
router.post('/', createReservation);
router.put('/:id', modifyReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;