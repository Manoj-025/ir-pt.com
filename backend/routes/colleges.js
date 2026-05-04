const router = require('express').Router();
const { College } = require('../models');
const { adminAuth } = require('../middleware/auth');

// PUBLIC: list (fees hidden unless ?showFee=true)
router.get('/', async (req, res) => {
  try {
    const { course, maxFee, q, showFee } = req.query;
    const filter = { active: true };
    if (course) filter.course = course;

    // Case-insensitive search across name, course, affiliation
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name:        rx },
        { course:      rx },
        { affiliation: rx },
        { badge:       rx },
      ];
    }

    let cols = await College.find(filter).sort({ name: 1 });
    if (maxFee) cols = cols.filter(c => c.fee <= +maxFee);

    const reveal = showFee === 'true';
    res.json({
      success: true,
      colleges: cols.map(c => ({
        _id:         c._id,
        name:        c.name,
        course:      c.course,
        seats:       c.seats,
        location:    c.location,
        affiliation: c.affiliation,
        badge:       c.badge,
        description: c.description,
        fee:         reveal ? c.fee : null,
        feeHidden:   !reveal,
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

// ADMIN: single add
router.post('/', adminAuth, async (req, res) => {
  try {
    const c = await new College(req.body).save();
    res.status(201).json({ success: true, college: c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: bulk upload — array of college objects
// POST /api/colleges/bulk
// Body: { colleges: [ { name, course, fee, seats, affiliation, badge, description }, ... ] }
router.post('/bulk', adminAuth, async (req, res) => {
  try {
    const { colleges } = req.body;

    if (!Array.isArray(colleges) || colleges.length === 0)
      return res.status(400).json({ error: 'colleges array is required and must not be empty' });

    const VALID_BADGES = ['Popular', 'Budget', 'Top Ranked', 'Govt', 'New', ''];
    let added   = 0;
    let skipped = 0;
    const errors = [];

    for (const row of colleges) {
      // Required field check
      if (!row.name || !row.course || !row.fee) {
        skipped++;
        errors.push(`Row skipped — missing name/course/fee: ${row.name || '(no name)'}`);
        continue;
      }

      // Clean & normalize
      const name        = String(row.name).trim();
      const course      = String(row.course).trim();
      const fee         = parseFloat(String(row.fee).replace(/[₹,\s]/g, ''));
      const seats       = parseInt(row.seats)       || 60;
      const affiliation = String(row.affiliation || '').trim();
      const description = String(row.description || '').trim();

      // Normalize badge casing
      let badge = String(row.badge || '').trim();
      const matchedBadge = VALID_BADGES.find(
        b => b.toLowerCase() === badge.toLowerCase()
      );
      badge = matchedBadge !== undefined ? matchedBadge : '';

      if (!fee || fee <= 0) {
        skipped++;
        errors.push(`${name}: fee must be a positive number (got "${row.fee}")`);
        continue;
      }

      try {
        await new College({
          name, course, fee, seats,
          affiliation, badge, description,
          active: true,
        }).save();
        added++;
      } catch (saveErr) {
        skipped++;
        errors.push(`${name} (${course}): ${saveErr.message}`);
      }
    }

    res.json({
      success: true,
      added,
      skipped,
      total:  colleges.length,
      errors: errors.slice(0, 20), // return max 20 error messages
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ADMIN: update single college
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const c = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, college: c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: delete college
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
