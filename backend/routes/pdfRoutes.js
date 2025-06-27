const express = require('express');
const router = express.Router();
const { generateEstimatePDF } = require('../controllers/pdfController'); // Correct import

// POST route for generating the estimate PDF
router.post('/pdf', generateEstimatePDF); // This matches the route used in frontend fetch

module.exports = router;
