import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(req) {
  const data = await req.json();

  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(25).text("Ashok Leyland MiTR Bus Estimate Bill", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Buyer Name: ${data.buyer?.name}`);
  doc.text(`Model: ${data.model}`);
  doc.text(`Amount: ₹${data.amount}`);
  doc.text(`GST: ${data.gst}%`);
  doc.text(`Total: ₹${data.total}`);
  doc.end();

  return new NextResponse(Buffer.concat(buffers), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=EstimateBill.pdf',
    },
  });
}