import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

import { seedDefaultScoringRules } from './models/ScoringRule.js';
// The queue processor is already defined in queues/event.queue.js

import app from './app.js';
import { createRealtimeServer } from './realtime.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MongoDB connection string (MONGO_URI) is not defined.');
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    await seedDefaultScoringRules();
    const server = createRealtimeServer(app);
    server.listen(PORT, () => {
      console.log(`Server (with Socket.io) running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// For Vercel serverless
export default app;
