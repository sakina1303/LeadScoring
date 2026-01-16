// Integration test for duplicate event (idempotency)
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Lead from '../src/models/Lead.js';
import Event from '../src/models/Event.js';
import ScoringRule from '../src/models/ScoringRule.js';

describe('Idempotency (Duplicate Event)', () => {
  let lead, eventId;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    lead = await Lead.create({ name: 'Dup Lead', email: 'dup@example.com', company: 'DupCo' });
    await ScoringRule.create({ event_type: 'Dup Event', points: 10, active: true });
  });
  afterAll(async () => {
    await Lead.deleteMany({});
    await Event.deleteMany({});
    await ScoringRule.deleteMany({});
    await mongoose.disconnect();
  });
  it('should not process duplicate event', async () => {
    const payload = { lead_id: lead._id, event_type: 'Dup Event', event_id: 'DUP-EVENT-1' };
    const res1 = await request(app).post('/api/events').send(payload);
    const res2 = await request(app).post('/api/events').send(payload);
    expect(res1.status).toBe(202);
    // Second request should fail with 500 due to duplicate key error (idempotency enforced by DB)
    expect(res2.status).toBe(500);
    // Only one event should exist in DB
    const events = await Event.find({ event_id: 'DUP-EVENT-1' });
    expect(events.length).toBe(1);
  });
});
