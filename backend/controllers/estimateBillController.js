const PDFDocument = require("pdfkit");

exports.generateEstimatePDF = (req, res) => {
  const data = req.body;
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=estimate-bill.pdf");
  doc.pipe(res);

  // Header
  doc
    .fontSize(18)
    .text("LAKSHMI MOTORS", { align: "center", underline: true })
    .moveDown(0.5);
  doc.fontSize(12).text("Authorised Dealer of Ashok Leyland", { align: "center" });
  doc.moveDown(1);

  let y = doc.y;

  // Invoice Details
  y = drawTable(doc, 40, y, ["IRN No", "Ack No", "Invoice No", "Date"], [
    [data.irnNo, data.ackNo, data.invoiceNo, data.date]
  ]);

  // Vehicle Details
  y = drawTable(doc, 40, y, ["Model", "Variant", "Color", "Chassis No", "Engine No", "PAN No", "Hypothecated To"], [
    [data.model, data.variant, data.vehicleColor, data.chassisNo, data.engineNo, data.panNo, data.hypothecatedTo]
  ]);

  // Buyer Info
  y = drawTable(doc, 40, y, ["Buyer Name", "Address", "GSTIN", "Phone", "State Code"], [
    [data.buyer.name, data.buyer.address, data.buyer.gstin, data.buyer.phone, data.buyer.stateCode]
  ]);

  // Consignor Info
  y = drawTable(doc, 40, y, ["Consignor Name", "Address", "GSTIN", "Phone", "State Code"], [
    [data.consignor.name, data.consignor.address, data.consignor.gstin, data.consignor.phone, data.consignor.stateCode]
  ]);

  // Invoice Items
  y = drawTable(doc, 40, y, ["SI", "Particular", "HSN", "GST %", "Qty", "Rate", "Per", "Amount"],
    data.items.map((item, i) => [
      i + 1,
      item.particular,
      item.hsn,
      item.gst,
      item.qty,
      item.rate,
      item.per,
      item.amount
    ])
  );

  // Tax Summary
  y = drawTable(doc, 40, y, ["HSN", "Taxable", "CGST %", "CGST Amt", "SGST %", "SGST Amt", "Total"],
    data.taxSummary.map(t => [
      t.hsn,
      t.taxable,
      t.cgst,
      t.cgstAmt,
      t.sgst,
      t.sgstAmt,
      t.totalTax
    ])
  );

  // Footer
  drawTable(doc, 40, y, ["Amount (Words)", "Declaration", "Signatory"], [
    [data.amountWords, data.declaration, data.signatory]
  ]);

  doc.end();
};

// ✅ Draw Table Function (with spacing and return nextY)
function drawTable(doc, startX, startY, headers, rows) {
  const colWidth = (doc.page.width - startX * 2) / headers.length;
  let currentY = startY;

  const headerHeight = calculateRowHeight(doc, headers, colWidth);
  headers.forEach((header, i) => {
    doc.rect(startX + i * colWidth, currentY, colWidth, headerHeight).stroke();
    doc.text(header, startX + i * colWidth + 2, currentY + 5, {
      width: colWidth - 4,
      align: "center"
    });
  });
  currentY += headerHeight;

  rows.forEach((row) => {
    const rowHeight = calculateRowHeight(doc, row, colWidth);

    if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
    }

    row.forEach((cell, i) => {
      doc.rect(startX + i * colWidth, currentY, colWidth, rowHeight).stroke();
      doc.text(String(cell), startX + i * colWidth + 2, currentY + 5, {
        width: colWidth - 4,
        align: "center"
      });
    });

    currentY += rowHeight;
  });

  return currentY + 20; // spacing after table
}

// ✅ Calculate max height of a table row based on content
function calculateRowHeight(doc, row, colWidth) {
  let maxHeight = 0;
  row.forEach(cell => {
    const textHeight = doc.heightOfString(String(cell), {
      width: colWidth - 4,
      align: "center"
    });
    if (textHeight > maxHeight) maxHeight = textHeight;
  });
  return maxHeight + 10; // padding
}