
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Event from '../models/Event.js';
import Queue from '../queues/event.queue.js';
import ScoringRule from '../models/ScoringRule.js';

const router = express.Router();

// GET /event-types - List all event types from scoring rules
router.get('/event-types', async (req, res, next) => {
  try {
    const rules = await ScoringRule.find({ active: true });
    const eventTypes = rules.map(rule => ({ value: rule.event_type, label: rule.event_type, points: rule.points }));
    res.json(eventTypes);
  } catch (err) {
    next(err);
  }
});

// POST / - Ingest event
router.post('/', async (req, res, next) => {
  try {
    const { lead_id, event_type, event_id, metadata } = req.body;
    if (!lead_id || !event_type) {
      return res.status(400).json({ error: 'lead_id and event_type are required' });
    }
    const newEvent = new Event({
      event_id: event_id || uuidv4(),
      lead_id,
      event_type,
      metadata,
    });
    await newEvent.save();
    // Push event to Bull queue (use default handler, not named job)
    await Queue.add({ event_id: newEvent.event_id });
    res.status(202).json({ success: true, event_id: newEvent.event_id });
  } catch (err) {
    next(err);
  }
});

export default router;
