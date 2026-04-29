const express = require('express');
const router = express.Router();
const {
  getPricingByRoom,
  upsertPricing
} = require('../controllers/pricingController');

router.get('/:roomId', getPricingByRoom);
router.post('/:roomId', upsertPricing);

module.exports = router;