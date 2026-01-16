import express from 'express';
import Lead from '../models/Lead.js';
import ScoreHistory from '../models/ScoreHistory.js';

const router = express.Router();

// Create a lead
router.post('/', async (req, res, next) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

// List all leads
router.get('/', async (req, res, next) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    next(err);
  }
});


// Top leads sorted by score
router.get('/leaderboard', async (req, res, next) => {
  try {
    const topLeads = await Lead.find().sort({ current_score: -1 }).limit(10);
    res.json(topLeads);
  } catch (err) {
    next(err);
  }
});

// Get lead details
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// Fetch score history for a lead
router.get('/:id/history', async (req, res, next) => {
  try {
    const history = await ScoreHistory.find({ lead_id: req.params.id }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
});

export default router;
