const router = require('express').Router();
const { Lead } = require('../models');
const { adminAuth } = require('../middleware/auth');

// PUBLIC: create lead
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, classYear, course, message, source, college } = req.body;
    if (!name?.trim() || !phone?.trim())
      return res.status(400).json({ error: 'Name and phone required' });
    const lead = await new Lead({
      name: name.trim(), phone: phone.trim(),
      email, classYear, course: course || 'General',
      message, source: source || 'Website', college
    }).save();
    res.status(201).json({ success: true, leadId: lead.leadId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: track by phone
router.get('/track/:phone', async (req, res) => {
  try {
    const lead = await Lead.findOne({ phone: req.params.phone })
      .select('name leadId status course college createdAt');
    if (!lead) return res.status(404).json({ error: 'No enquiry found' });
    res.json({ success: true, lead });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: get all leads
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { phone: new RegExp(q) },
      { course: new RegExp(q, 'i') }
    ];
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).limit(300),
      Lead.countDocuments(filter)
    ]);
    res.json({ success: true, leads, total });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: update lead
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, lead });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: delete lead
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: bulk upload
router.post('/bulk', adminAuth, async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads)) return res.status(400).json({ error: 'Array required' });
    let count = 0;
    for (const d of leads.filter(l => l.name && l.phone)) {
      try { await new Lead({ ...d, source: d.source || 'Upload' }).save(); count++; } catch (_) {}
    }
    res.json({ success: true, imported: count });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
