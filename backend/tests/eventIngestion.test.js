// Integration test for event ingestion → queue → score update
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Lead from '../src/models/Lead.js';
import Event from '../src/models/Event.js';
import ScoringRule from '../src/models/ScoringRule.js';

describe('Event Ingestion Flow', () => {
  let lead;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    lead = await Lead.create({ name: 'Test Lead', email: 'test@example.com', company: 'TestCo' });
    await ScoringRule.create({ event_type: 'Test Event', points: 10, active: true });
  });
  afterAll(async () => {
    await Lead.deleteMany({});
    await Event.deleteMany({});
    await ScoringRule.deleteMany({});
    await mongoose.disconnect();
  });
  it('should ingest event and enqueue job', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ lead_id: lead._id, event_type: 'Test Event' });
    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('event_id');
  });
});
