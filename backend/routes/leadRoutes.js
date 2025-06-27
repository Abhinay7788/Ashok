const express = require('express');
const router = express.Router();

const {
  createLead,
  getLeads,
  updateStatus,
  deleteLead,
  downloadExcel,
  resendLeadEmail
} = require('../controllers/leadController'); // ✅ Make sure this path is correct

// ✅ Routes
router.get('/', getLeads);
router.post('/', createLead);
router.patch('/status/:id', updateStatus);
router.delete('/:id', deleteLead);
router.get('/download/excel', downloadExcel);
router.post('/resend/:id', resendLeadEmail); // ✅ Notice this matches the exported name

module.exports = router;