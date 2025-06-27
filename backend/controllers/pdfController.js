const PDFDocument = require('pdfkit');

const generateEstimatePDF = (req, res) => {
  const { buyerName, model, amount, gst, total } = req.body;

  const doc = new PDFDocument();
  let filename = `Estimate_${buyerName}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-type', 'application/pdf');

  doc.fontSize(20).text("Ashok Leyland MiTR Bus Estimate Bill", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Buyer Name: ${buyerName}`);
  doc.text(`Model: ${model}`);
  doc.text(`Amount: ₹${amount}`);
  doc.text(`GST: ${gst}%`);
  doc.text(`Total: ₹${total}`);
  doc.end();

  doc.pipe(res);
};

module.exports = { generateEstimatePDF }; 