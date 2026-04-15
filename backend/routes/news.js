const router = require('express').Router();
const { News } = require('../models');
const { adminAuth } = require('../middleware/auth');

// ADMIN: all (MUST be before /:id)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    res.json({ success: true, news: await News.find().sort({ createdAt: -1 }) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: published list
router.get('/', async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.category) filter.category = req.query.category;
    res.json({ success: true, news: await News.find(filter).sort({ createdAt: -1 }).limit(30) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: single by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const a = await News.findOne({ slug: req.params.slug, published: true });
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, article: a });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const a = await new News(req.body).save();
    res.status(201).json({ success: true, article: a });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const a = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, article: a });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
