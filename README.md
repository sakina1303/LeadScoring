# LeadConnect - Event-Driven Lead Scoring System

A modern, real-time lead scoring platform built with React, Node.js, and event-driven architecture.

## Features

- **Real-time Scoring**: Lead scores update instantly as events are processed
- **Event-Driven Architecture**: Built on Bull queues and Redis for scalable event processing
- **Configurable Rules**: Define custom scoring rules for different event types
- **Live Dashboard**: Monitor leads with real-time updates via Socket.io
- **Modern UI**: Clean, human-friendly interface with gradient designs
- **Full Test Coverage**: Comprehensive unit and integration tests

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Bull (Redis-based queue)
- Socket.io (real-time updates)
- Jest + Supertest (testing)

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Socket.io-client

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally or connection string
- Redis running locally

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd scoring
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../inspo
npm install
```

4. Configure environment variables
Create `backend/.env`:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/lead-scoring
REDIS_URL=redis://127.0.0.1:6379
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend
```bash
cd inspo
npm run dev
```

3. Open http://localhost:8080 in your browser

### Running Tests
```bash
cd backend
npm test
```

## API Endpoints

- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `GET /api/leads/:id/history` - Get score history for a lead
- `POST /api/events` - Submit an event for processing
- `GET /api/events/event-types` - Get available event types
- `POST /api/rules` - Create a scoring rule
- `GET /api/rules` - Get all scoring rules

## How It Works

1. **Submit Events**: When a lead performs an action (email open, page view, etc.), submit an event via the API
2. **Queue Processing**: Events are added to a Bull queue and processed asynchronously
3. **Score Calculation**: The worker fetches the scoring rule and updates the lead's score
4. **Real-time Updates**: Score changes are broadcast to connected clients via Socket.io
5. **Dashboard Updates**: The frontend receives the update and refreshes the UI instantly

## Project Structure

```
scoring/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── queues/          # Bull queue definitions
│   │   ├── workers/         # Queue processors
│   │   ├── realtime.js      # Socket.io setup
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry point
│   └── tests/               # Test files
└── inspo/
    └── src/
        ├── components/      # React components
        ├── pages/           # Page components
        └── lib/             # Utilities and API client
```

## License

MIT
