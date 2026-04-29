const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'modified'], default: 'confirmed' },
  bookingRef: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);