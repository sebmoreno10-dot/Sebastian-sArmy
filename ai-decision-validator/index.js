require('dotenv').config();

const express = require('express');
const cors = require('cors');
const validateDecision = require('./agents');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/validate', async (req, res) => {
  const { decision } = req.body;

  if (!decision || typeof decision !== 'string') {
    return res.status(400).json({ error: 'decision (string) is required' });
  }

  try {
    const feedback = await validateDecision(decision);
    res.json({ decision, feedback });
  } catch (error) {
    res.status(502).json({ error: 'Failed to validate decision' });
  }
});

app.listen(port, () => {
  console.log(`ai-decision-validator listening on port ${port}`);
});
