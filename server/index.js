const express = require('express');
const cors = require('cors');

const zodiacRoutes = require('./routes/zodiac');
const characterRoutes = require('./routes/character');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/zodiac', zodiacRoutes);
app.use('/api/character', characterRoutes);

app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'ok', data: { status: 'running' } });
});

app.listen(PORT, () => {
  console.log(`StarWhisper server running on http://localhost:${PORT}`);
});
