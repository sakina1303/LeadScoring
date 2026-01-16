
import express from 'express';
import ScoringRule from '../models/ScoringRule.js';

const router = express.Router();

// Create a new scoring rule
router.post('/', async (req, res, next) => {
  try {
    const rule = new ScoringRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    next(err);
  }
});

// List all scoring rules
router.get('/', async (req, res, next) => {
  try {
    const rules = await ScoringRule.find();
    res.json(rules);
  } catch (err) {
    next(err);
  }
});

// Update points or active flag
router.put('/:id', async (req, res, next) => {
  try {
    const { points, active } = req.body;
    const update = {};
    if (typeof points !== 'undefined') update.points = points;
    if (typeof active !== 'undefined') update.active = active;
    const rule = await ScoringRule.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    res.json(rule);
  } catch (err) {
    next(err);
  }
});

export default router;
