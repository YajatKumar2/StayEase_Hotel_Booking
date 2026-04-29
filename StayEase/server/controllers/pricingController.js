const Pricing = require('../models/Pricing');

// Get pricing for a room
exports.getPricingByRoom = async (req, res) => {
  try {
    const pricing = await Pricing.findOne({ room: req.params.roomId });
    res.json(pricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or update pricing (admin)
exports.upsertPricing = async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate(
      { room: req.params.roomId },
      req.body,
      { upsert: true, new: true }
    );
    res.json(pricing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};