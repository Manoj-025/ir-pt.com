const router = require('express').Router();
const { College } = require('../models');
const { adminAuth } = require('../middleware/auth');

// PUBLIC: list (fees hidden unless ?showFee=true)
router.get('/', async (req, res) => {
  try {
    const { course, maxFee, q, showFee } = req.query;
    const filter = { active: true };
    if (course) filter.course = course;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { course: new RegExp(q, 'i') }
    ];
    let cols = await College.find(filter).sort({ name: 1 });
    if (maxFee) cols = cols.filter(c => c.fee <= +maxFee);
    const reveal = showFee === 'true';
    res.json({
      success: true,
      colleges: cols.map(c => ({
        _id: c._id, name: c.name, course: c.course,
        seats: c.seats, location: c.location,
        affiliation: c.affiliation, badge: c.badge,
        description: c.description,
        fee: reveal ? c.fee : null,
        feeHidden: !reveal,
      }))
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: all with fees — MUST come before /:id
router.get('/admin', adminAuth, async (req, res) => {
  try {
    res.json({ success: true, colleges: await College.find().sort({ createdAt: -1 }) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const c = await new College(req.body).save();
    res.status(201).json({ success: true, college: c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const c = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, college: c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
