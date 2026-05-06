const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Pricing = require('../models/Pricing');
const { sendConfirmationEmail, sendCancellationEmail, sendModificationEmail } = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');

// Check availability
exports.checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, type, amenities } = req.query;

    // Find all rooms matching filters
    let roomQuery = {};
    if (type) roomQuery.type = type;
    if (amenities) roomQuery.amenities = { $all: amenities.split(',') };
    roomQuery.isAvailable = true;

    const rooms = await Room.find(roomQuery);

    // Find conflicting reservations
    const conflictingReservations = await Reservation.find({
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
      ]
    }).select('room');

    const bookedRoomIds = conflictingReservations.map(r => r.room.toString());
    const availableRooms = rooms.filter(r => !bookedRoomIds.includes(r._id.toString()));

    // Attach pricing to each available room
    const roomsWithPricing = await Promise.all(availableRooms.map(async (room) => {
      const pricing = await Pricing.findOne({ room: room._id });
      return { ...room.toObject(), pricing };
    }));

    res.json(roomsWithPricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create reservation
exports.createReservation = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guestName, guestEmail, guests, totalPrice } = req.body;

    // Double check for conflicts
    const conflict = await Reservation.findOne({
      room,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
      ]
    });

    if (conflict) return res.status(409).json({ message: 'Room is not available for selected dates' });

    const reservation = new Reservation({
      room, checkIn, checkOut, guestName, guestEmail,
      guests, totalPrice, bookingRef: uuidv4().slice(0, 8).toUpperCase()
    });

    await reservation.save();
    await sendConfirmationEmail(reservation);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all reservations (admin)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('room');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reservations by email (guest)
exports.getReservationsByEmail = async (req, res) => {
  try {
    const reservations = await Reservation.find({ guestEmail: req.params.email }).populate('room');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modify reservation
exports.modifyReservation = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Check conflicts excluding current reservation
    const conflict = await Reservation.findOne({
      room: reservation.room,
      _id: { $ne: reservation._id },
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
      ]
    });

    if (conflict) return res.status(409).json({ message: 'Room is not available for new dates' });

    reservation.checkIn = checkIn;
    reservation.checkOut = checkOut;
    reservation.status = 'modified';
    await reservation.save();
    await sendModificationEmail(reservation);
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = 'cancelled';
    await reservation.save();
    await sendCancellationEmail(reservation);
    res.json({ message: 'Reservation cancelled', reservation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reservations by room
exports.getReservationsByRoom = async (req, res) => {
  try {
    const reservations = await Reservation.find({ room: req.params.roomId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get daily report
exports.getDailyReport = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const allActiveReservations = await Reservation.find({
      status: { $ne: 'cancelled' }
    }).populate('room');

    const checkInsToday = allActiveReservations.filter(r =>
      new Date(r.checkIn) >= startOfDay && new Date(r.checkIn) <= endOfDay
    );

    const checkOutsToday = allActiveReservations.filter(r =>
      new Date(r.checkOut) >= startOfDay && new Date(r.checkOut) <= endOfDay
    );

    const currentlyOccupied = allActiveReservations.filter(r =>
      new Date(r.checkIn) <= endOfDay && new Date(r.checkOut) >= startOfDay
    );

    const totalRevenue = checkInsToday.reduce((sum, r) => sum + r.totalPrice, 0);

    res.json({
      date: new Date().toDateString(),
      totalCheckIns: checkInsToday.length,
      totalCheckOuts: checkOutsToday.length,
      totalOccupied: currentlyOccupied.length,
      totalRevenue,
      checkIns: checkInsToday,
      checkOuts: checkOutsToday,
      occupied: currentlyOccupied
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};