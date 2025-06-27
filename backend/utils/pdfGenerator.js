const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.generateLeadPDF = async (lead) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  page.drawText(`Lead Details:
School: ${lead.schoolName}
Contact: ${lead.inChargeName} (${lead.inChargePhone})
Category: ${lead.category}
Email: ${lead.email}`, { x: 50, y: 350 });

  return await pdfDoc.save();
};