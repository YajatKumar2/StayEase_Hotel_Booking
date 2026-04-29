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

router.get('/availability', checkAvailability);
router.get('/', getAllReservations);
router.get('/guest/:email', getReservationsByEmail);
router.post('/', createReservation);
router.put('/:id', modifyReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;