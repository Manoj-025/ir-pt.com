require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
const path    = require('path');

const app = express();

/* ── CORS: allow all origins in dev, restrict in prod ── */
app.use(cors({ origin: true, credentials: true }));

/* ── Body parsers ─────────────────────────────────────── */
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── API routes ──────────────────────────────────────── */
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/leads',    require('./routes/leads'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/news',     require('./routes/news'));
app.use('/api/jobs',     require('./routes/jobs'));
app.use('/api/stats',    require('./routes/stats'));
app.get('/api/health', (_,res) => res.json({ ok:true, time: new Date() }));

/* ── Serve frontend static files ─────────────────────── */
const STATIC = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(STATIC));
app.get('*', (req,res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error:'Not found' });
  res.sendFile(path.join(STATIC, 'index.html'));
});

/* ── Start ───────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    console.error('   → Check your MONGO_URI in .env file');
    process.exit(1);
  });
