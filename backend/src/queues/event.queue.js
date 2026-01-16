import Bull from 'bull';
import Redis from 'ioredis';
import Event from '../models/Event.js';
import Lead from '../models/Lead.js';
import ScoringRule from '../models/ScoringRule.js';

import ScoreHistory from '../models/ScoreHistory.js';
import { emitScoreUpdate } from '../realtime.js';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redis = new Redis(redisUrl);

const queue = new Bull('event-processing', redisUrl);

queue.process(async (job) => {
  const { event_id } = job.data;
  try {
    const event = await Event.findOne({ event_id });
    if (!event) throw new Error(`Event not found: ${event_id}`);
    if (event.processed) {
      console.log(`[Idempotent] Event already processed: ${event_id}`);
      return;
    }
    // Fetch scoring rule
    const rule = await ScoringRule.findOne({ event_type: event.event_type, active: true });
    if (!rule) {
      console.log(`[No Rule] No active scoring rule for event_type: ${event.event_type}`);
      event.processed = true;
      await event.save();
      return;
    }
    // Update lead score safely
    const lead = await Lead.findById(event.lead_id);
    if (!lead) throw new Error(`Lead not found: ${event.lead_id}`);
    const prevScore = lead.current_score || 0;
    const newScore = Math.min(prevScore + rule.points, 1000);
    lead.current_score = newScore;
    await lead.save();
    // Emit real-time update
    emitScoreUpdate(lead._id.toString(), newScore);
    // Save score history
    await ScoreHistory.create({
      lead_id: lead._id,
      score: newScore,
      reason: `Event: ${event.event_type}`,
      timestamp: new Date(),
    });
    // Mark event as processed
    event.processed = true;
    await event.save();
    console.log(`[Processed] Event ${event_id}: Lead ${lead._id} scored ${rule.points} (Total: ${newScore})`);
  } catch (err) {
    console.error(`[Error] Processing event ${event_id}:`, err.message);
    job.moveToFailed({ message: err.message });
  }
});

export default queue;
