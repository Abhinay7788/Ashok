const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // ✅ Gmail with App Password
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email with optional attachments and category-specific brochure
 * 
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {Buffer|null} leadPDFBuffer - Optional lead details PDF buffer
 * @param {string|null} category - "Bus" or "Truck" to attach respective brochure
 */
const sendEmail = async (to, subject, text, leadPDFBuffer = null, category = null) => {
  if (!to) throw new Error("Email address is missing!");

  const attachments = [];

  // ✅ Attach brochure only if category is provided
  if (category) {
    const brochurePath = category === "Bus"
      ? path.join(__dirname, '../public/brochures/MitrBusBrochure.pdf')
      : path.join(__dirname, '../public/brochures/TruckBrochure.pdf');

    const brochureFile = fs.readFileSync(brochurePath);
    attachments.push({ filename: 'ProductBrochure.pdf', content: brochureFile });
  }

  // ✅ Optional: attach lead PDF
  if (leadPDFBuffer) {
    attachments.push({ filename: 'LeadDetails.pdf', content: leadPDFBuffer });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    ...(attachments.length > 0 && { attachments })
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
