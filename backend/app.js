// ✅ Load Environment Variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connect');

// ✅ Routes
const leadRoutes = require('./routes/leadRoutes');
const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const estimateBillRoutes = require('./routes/estimateBillRoutes');

// ✅ Initialize Express App
const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Use All Routes
app.use('/api/lead', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/estimatebill', estimateBillRoutes);

// ✅ (Optional) Test Cohere AI Route
const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY });

app.post('/api/test-ai', async (req, res) => {
  try {
    const leadText = req.body.lead || "A school is looking for 2 Ashok Leyland buses";
    const response = await cohere.generate({
      model: "command",
      prompt: `Score this lead on a 0 to 1 scale: ${leadText}`,
      maxTokens: 10,
    });

    const text = response.generations[0]?.text?.trim();
    const score = parseFloat(text);
    res.json({ score: isNaN(score) ? 0 : Math.min(Math.max(score, 0), 1) });
  } catch (err) {
    console.error("Cohere error:", err.message);
    res.status(500).json({ error: "Cohere API failed" });
  }
});

// ✅ Export Express App
module.exports = app;