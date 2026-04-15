const router = require('express').Router();
const { Job, Lead } = require('../models');
const { adminAuth } = require('../middleware/auth');

// ADMIN: all jobs (MUST be before /:id)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    res.json({ success: true, jobs: await Job.find().sort({ createdAt: -1 }) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: active jobs
router.get('/', async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.q) filter.$or = [
      { title: new RegExp(req.query.q, 'i') },
      { company: new RegExp(req.query.q, 'i') }
    ];
    res.json({ success: true, jobs: await Job.find(filter).sort({ createdAt: -1 }) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: apply for job
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const { name, phone, email, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    const lead = await new Lead({
      name, phone, email,
      course: job.title,
      source: 'Job Page',
      message: `Applied: ${job.title} @ ${job.company}. ${message || ''}`,
    }).save();
    res.json({ success: true, leadId: lead.leadId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const j = await new Job(req.body).save();
    res.status(201).json({ success: true, job: j });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const j = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!j) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, job: j });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
