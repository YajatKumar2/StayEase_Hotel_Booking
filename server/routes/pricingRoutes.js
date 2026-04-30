const express = require('express');
const router = express.Router();
const {
  getPricingByRoom,
  upsertPricing
} = require('../controllers/pricingController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/:roomId', getPricingByRoom);
router.post('/:roomId', verifyAdmin, upsertPricing);

module.exports = router;