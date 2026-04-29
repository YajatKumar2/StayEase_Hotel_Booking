const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  basePrice: { type: Number, required: true },
  seasonalRates: [
    {
      label: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      price: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Pricing', pricingSchema);