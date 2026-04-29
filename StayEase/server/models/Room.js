const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe'], required: true },
  description: { type: String },
  amenities: [{ type: String }],
  maxGuests: { type: Number, required: true },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);