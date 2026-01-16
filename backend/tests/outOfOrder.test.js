// Integration test for out-of-order event handling
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Lead from '../src/models/Lead.js';
import Event from '../src/models/Event.js';
import ScoringRule from '../src/models/ScoringRule.js';

describe('Out-of-Order Event Handling', () => {
  let lead;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    lead = await Lead.create({ name: 'Order Lead', email: 'order@example.com', company: 'OrderCo' });
    await ScoringRule.create({ event_type: 'Order Event', points: 10, active: true });
  });
  afterAll(async () => {
    await Lead.deleteMany({});
    await Event.deleteMany({});
    await ScoringRule.deleteMany({});
    await mongoose.disconnect();
  });
  it('should process events regardless of order', async () => {
    const payload1 = { lead_id: lead._id, event_type: 'Order Event', event_id: 'ORDER-1' };
    const payload2 = { lead_id: lead._id, event_type: 'Order Event', event_id: 'ORDER-2' };
    const res2 = await request(app).post('/api/events').send(payload2);
    const res1 = await request(app).post('/api/events').send(payload1);
    expect(res1.status).toBe(202);
    expect(res2.status).toBe(202);
    // Both events should exist, order does not matter
    const events = await Event.find({ lead_id: lead._id });
    expect(events.length).toBe(2);
  });
});
