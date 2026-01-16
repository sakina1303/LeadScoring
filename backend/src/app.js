import express from 'express';
import cors from 'cors';


import leadsRouter from './routes/leads.routes.js';
import eventsRouter from './routes/events.routes.js';
import rulesRouter from './routes/rules.routes.js';
import batchRouter from './routes/batch.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/batch', batchRouter);

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
