import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Event from '../models/Event.js';
import Queue from '../queues/event.queue.js';

const router = express.Router();

// POST /batch - Batch event ingestion
router.post('/', async (req, res, next) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events array is required' });
    }
    const results = [];
    for (const evt of events) {
      const { lead_id, event_type, event_id, metadata } = evt;
      if (!lead_id || !event_type) {
        results.push({ success: false, error: 'lead_id and event_type are required', event: evt });
        continue;
      }
      try {
        const newEvent = new Event({
          event_id: event_id || uuidv4(),
          lead_id,
          event_type,
          metadata,
        });
        await newEvent.save();
        await Queue.add('processEvent', { event_id: newEvent.event_id });
        results.push({ success: true, event_id: newEvent.event_id });
      } catch (err) {
        results.push({ success: false, error: err.message, event: evt });
      }
    }
    res.status(202).json({ results });
  } catch (err) {
    next(err);
  }
});

export default router;
