# Event-Driven Lead Scoring System

A production-grade lead scoring system built with Node.js, MongoDB, Redis, Bull queue, and Socket.io for real-time updates.


## Features

- Event-driven architecture with Bull queue
- Real-time score updates via Socket.io
- Idempotent event processing
- Event ordering and timestamps
- Batch event ingestion via API
- Configurable scoring rules
- Score cap (1000 points max)
- Full audit trail (score history)
- Leaderboard and filtering
- Comprehensive test coverage
## Folder Structure

```
scoring/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── redis.js
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── Lead.js
│   │   │   ├── ScoreHistory.js
│   │   │   └── ScoringRule.js
│   │   ├── queues/
│   │   │   └── event.queue.js
│   │   ├── routes/
│   │   │   ├── batch.routes.js
│   │   │   ├── events.routes.js
│   │   │   ├── leads.routes.js
│   │   │   └── rules.routes.js
│   │   ├── workers/
│   │   │   └── event.worker.js
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── realtime.js
│   │   └── server.js
│   ├── tests/
│   │   ├── eventIngestion.test.js
│   │   ├── idempotency.test.js
│   │   ├── outOfOrder.test.js
│   │   ├── scoringEngine.test.js
│   │   └── setup.js
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AppLayout.tsx
│   │   │   ├── leads/
│   │   │   │   ├── EventTimeline.tsx
│   │   │   │   ├── LeadFilters.tsx
│   │   │   │   ├── LeadTable.tsx
│   │   │   │   ├── LeaderboardCard.tsx
│   │   │   │   └── ScoreChart.tsx
│   │   │   └── ui/
│   │   │       └── ... (UI components)
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── mockData.ts
│   │   │   ├── socket.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LeadDetail.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── SubmitEvent.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── README.md
├── package.json
└── ...
```

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Redis
- Bull (queue system)
- Socket.io (real-time)
- Jest + Supertest (testing)

**Frontend:**
- React + TypeScript
- Vite
- TanStack Query
- shadcn/ui + Tailwind CSS
- Framer Motion
- socket.io-client

## Setup

### Prerequisites
- Node.js 18+
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

3. Create backend `.env` file
```bash
cp .env.example .env
# Edit .env with your MongoDB and Redis URLs
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Project

1. Start MongoDB and Redis (if running locally)

2. Start the backend
```bash
cd backend
npm run dev
```

3. Start the frontend
```bash
cd frontend
npm run dev
```

4. Open http://localhost:8080 in your browser

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads/:id` - Get lead details
- `GET /api/leads/:id/history` - Get score history
- `GET /api/leads/leaderboard` - Get top 10 leads

### Events
- `POST /api/events` - Submit a single event
- `POST /api/batch` - Batch submit multiple events
- `GET /api/events/event-types` - Get available event types

### Scoring Rules
- `GET /api/rules` - Get all scoring rules
- `POST /api/rules` - Create a new scoring rule
- `PUT /api/rules/:id` - Update a scoring rule

## Event Types (Default)

- Email Open: 10 points
- Page View: 5 points
- Form Submission: 20 points
- Demo Request: 50 points
- Purchase: 100 points

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## License

MIT
