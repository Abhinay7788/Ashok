const Lead = require('../models/Lead');
const sendEmail = require('../services/sendEmail');
const aiLeadScorer = require('../services/aiLeadScorer');
const excelJS = require('exceljs');
const path = require('path');
// const sendSMS = require('../services/sendSMS'); // Uncomment if using SMS

// ✅ Create New Lead
exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // ✅ AI Lead Score (0-1)
    const score = await aiLeadScorer(leadData);
    leadData.leadScore = score;
    leadData.status = leadData.status || "New";

    // ✅ Save to MongoDB
    const newLead = new Lead(leadData);
    await newLead.save();

    // ✅ PDF Brochure
    const brochurePath = path.join(__dirname, '../public/brochures/MitrBusBrochure.pdf');

    // ✅ Send Email
    try {
      await sendEmail(
        leadData.email,
        'Thanks for showing interest in Ashok Leyland!',
        `We are delighted to introduce the MiTR School Bus from Ashok Leyland, a trusted name in commercial vehicles across India.

Specifically designed for school transportation, the MiTR ensures student safety, comfort, and reliability, and is fully BS6-compliant. Key features include:

✅ Ergonomic seating for maximum comfort  
✅ Superior visibility and advanced safety standards  
✅ Smart design with excellent fuel efficiency  
✅ Easy maintenance and dependable performance  

MiTR buses are already enhancing student transport at schools nationwide. With Ashok Leyland’s legacy of excellence, the MiTR offers a modern, safe, and efficient solution for your institution.

We would be pleased to arrange a demo or presentation at your convenience.

Warm regards,  
Bhagavathi Rao  
Ashok Leyland / Lakshmi Motors  
📞 7337449266`,
        brochurePath
      );
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
    }

    // ✅ Optional: Send SMS (only if sendSMS is defined)
    // try {
    //   await sendSMS(
    //     leadData.inChargePhone,
    //     'Thanks for your interest in Ashok Leyland! Check your email for the brochure.'
    //   );
    // } catch (smsError) {
    //   console.error("❌ SMS sending failed:", smsError.message);
    // }

    res.json({
      message: '✅ Lead saved & notifications attempted',
      redirectTo: '/dashboard'
    });

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    res.status(500).json({ message: 'Failed to create lead' });
  }
};

// ✅ GET All Leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

// ✅ Update Lead Status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedLead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ✅ DELETE Lead
exports.deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lead" });
  }
};

// ✅ Download Excel
exports.downloadExcel = async (req, res) => {
  try {
    const leads = await Lead.find();
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads');

    worksheet.columns = [
      { header: 'School Name', key: 'schoolName', width: 20 },
      { header: 'College Name', key: 'collegeName', width: 20 },
      { header: 'In-Charge', key: 'inChargeName', width: 20 },
      { header: 'Phone', key: 'inChargePhone', width: 15 },
      { header: 'Mileage', key: 'mileage', width: 10 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Route', key: 'route', width: 15 },
      { header: 'Seats', key: 'seats', width: 10 },
      { header: 'Num Buses', key: 'numBuses', width: 10 },
      { header: 'Requirement', key: 'requirement', width: 15 },
      { header: 'Strength', key: 'strength', width: 10 },
      { header: 'Financier', key: 'financier', width: 20 },
      { header: 'Existing Model', key: 'existingModel', width: 20 },
      { header: 'Weakness', key: 'weakness', width: 20 },
      { header: 'Category', key: 'category', width: 10 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'Lead Score', key: 'leadScore', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    leads.forEach(lead => {
      worksheet.addRow(lead.toObject());
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to download Excel' });
  }
};

// ✅ Resend Email
exports.resendLeadEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const subject = "Follow-up from Ashok Leyland CRM";
    const message = `Dear ${lead.inChargeName},

We are following up on your inquiry regarding ${lead.requirement}. Please get in touch for more details.

Warm regards,  
Ashok Leyland Team`;

    await sendEmail(lead.email, subject, message);

    res.json({ message: "✅ Email resent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error resending email", error: error.message });
  }
};