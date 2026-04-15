const router = require('express').Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Wrong password' });
  res.json({ success: true, token: process.env.ADMIN_PASSWORD });
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const token = req.headers['x-admin-token'] || '';
  res.json({ valid: token === process.env.ADMIN_PASSWORD });
});

module.exports = router;
