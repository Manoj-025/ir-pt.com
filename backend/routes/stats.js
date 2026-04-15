const router = require('express').Router();
const { Lead, College, News, Job } = require('../models');
const { adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, async (req, res) => {
  try {
    const [total, newL, enrolled, followup, colleges, news, jobs] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Enrolled' }),
      Lead.countDocuments({ status: 'Follow-up' }),
      College.countDocuments({ active: true }),
      News.countDocuments({ published: true }),
      Job.countDocuments({ active: true }),
    ]);
    res.json({ success: true, stats: { total, newL, enrolled, followup, colleges, news, jobs } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
