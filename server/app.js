const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const exercisesRouter = require('./routes/exercises');
const validateRouter = require('./routes/validate');

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({ contentSecurityPolicy: false }));
if (isDev) {
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
}
app.use(express.json({ limit: '64kb' }));

app.use('/api/exercises', exercisesRouter);
app.use('/api/validate', validateRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`infra-lab running on http://localhost:${PORT}`);
});
