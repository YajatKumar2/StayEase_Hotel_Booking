const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createReservation,
  getAllReservations,
  getReservationsByEmail,
  getReservationsByRoom,
  modifyReservation,
  cancelReservation,
  getDailyReport
} = require('../controllers/reservationController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.get('/', verifyAdmin, getAllReservations);
router.get('/guest/:email', getReservationsByEmail);
router.get('/room/:roomId', getReservationsByRoom);
router.post('/', createReservation);
router.put('/:id', modifyReservation);
router.patch('/:id/cancel', cancelReservation);
router.get('/report/daily', verifyAdmin, getDailyReport);

module.exports = router;