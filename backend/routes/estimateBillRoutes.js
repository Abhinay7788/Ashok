const express = require('express');
const router = express.Router();
const { generateEstimatePDF } = require('../controllers/estimateBillController');

// PDF Download Route
router.post('/pdf', generateEstimatePDF);

module.exports = router;