# Family Activity Finder

AI-powered family activity recommendations using Claude API with web search.

## Features

- 🎯 Smart activity recommendations based on location, kids' ages, and preferences
- 🗺️ Both Google Maps and Apple Maps directions
- 📱 Responsive design (mobile + desktop)
- 🌐 Real-time web search for current activities
- 📍 Auto-detect location using browser geolocation

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- TailwindCSS
- Geolocation API

**Backend:**
- Node.js + Express + TypeScript
- Anthropic Claude API (Sonnet 4.5)
- Web Search Tool

## Architecture

```
User Input (Form)
  ↓
React Frontend (Port 5174)
  ↓ POST /api/search
Express Backend (Port 3001)
  ↓ Anthropic SDK
Claude Sonnet 4.5 + Web Search Tool
  ↓ JSON Response (20 activities)
Frontend Display (Cards)
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### 1. Clone and Install

```bash
git clone https://github.com/krishisk-prog/family-activity-finder-planner.git
cd family-activity-finder-planner

# Install root dependencies (for running both servers)
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env and add your Anthropic API key
```

The `.env` file should contain:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

**Frontend (.env.local):**

The `client/.env.local` file is already created with:
```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Run the Application

From the project root:
```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:5174
- Backend: http://localhost:3001

Or run them separately:
```bash
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## API Documentation

### POST /api/search

Search for family activities.

**Request:**
```json
{
  "city": "Seattle, WA",
  "kidsAges": "5, 8",
  "availability": "Saturday afternoon",
  "maxDistance": "25",
  "preferences": "outdoor, educational"
}
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "activities": [
    {
      "id": 1,
      "name": "Woodland Park Zoo",
      "emoji": "🦁",
      "website": "https://...",
      "address": "5500 Phinney Ave N, Seattle, WA 98103",
      "googleMapsLink": "https://www.google.com/maps/dir/...",
      "appleMapsLink": "https://maps.apple.com/...",
      "description": "Perfect for your 5 and 8 year olds..."
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Failed to connect to AI service",
  "message": "Please try again in a moment"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-17T02:06:18.243Z",
  "uptime": 24.99
}
```

## Project Structure

```
family-activity-finder-planner/
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── SearchForm.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ResultsGrid.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── services/        # API client
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── data/            # Dummy data (M1 only)
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.local          # Frontend environment variables
│   └── package.json
├── backend/                 # Express API server
│   ├── src/
│   │   ├── server.ts        # Express app setup
│   │   ├── routes/          # API routes
│   │   │   └── search.ts
│   │   ├── services/        # Business logic
│   │   │   ├── claudeService.ts
│   │   │   └── activityFormatter.ts
│   │   └── types/           # TypeScript types (if needed)
│   ├── .env                 # Backend environment variables (not in git)
│   ├── .env.example         # Template for .env
│   └── package.json
├── spec.md                  # Technical specification
├── prompt.md                # Claude API prompt template
├── todo.md                  # Development milestones
├── package.json             # Root package.json (runs both servers)
└── README.md                # This file
```

## Development

### Hot Reload
- **Frontend**: Vite HMR
- **Backend**: Nodemon + ts-node

### TypeScript
- Strict mode enabled
- Separate tsconfig for frontend and backend

### Scripts

**Root:**
- `npm run dev` - Start both frontend and backend
- `npm run dev:client` - Start only frontend
- `npm run dev:backend` - Start only backend

**Backend:**
- `npm run dev` - Start with nodemon (hot reload)
- `npm run build` - Compile TypeScript to dist/
- `npm start` - Run compiled JavaScript

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Testing Checklist

**Backend:**
- ✅ Server starts on port 3001
- ✅ Health endpoint returns status
- ✅ TypeScript compiles without errors
- ⏳ /api/search endpoint (requires API key)

**Frontend:**
- ✅ TypeScript compiles without errors
- ✅ Dev server starts on port 5174
- ✅ Form with 5 input fields renders
- ✅ Location auto-detection works
- ⏳ Full end-to-end search (requires backend + API key)

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key | `sk-ant-xxxxx` |
| `PORT` | No | Backend server port | `3001` (default) |
| `NODE_ENV` | No | Environment | `development` |
| `FRONTEND_URL` | No | Frontend URL for CORS | `http://localhost:5174` |

### Frontend (`client/.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:3001/api` |

## API Cost Estimates

### Claude API (web search enabled)
- **Base cost:** $10 per 1,000 searches
- **Token costs:** ~$3-5 per 1,000 input tokens, ~$15 per 1,000 output tokens (Sonnet 4.5)
- **Estimated per search:** $0.02-0.05 (includes search + reasoning + response)

### Monthly estimates (500 searches/month)
- Claude: ~$10-25

## Milestones

- ✅ **Milestone 1:** UI with Dummy Data - COMPLETED
- ✅ **Milestone 2:** Claude API Integration - COMPLETED
- ⏳ **Milestone 3:** Polish & Deploy - PENDING

## Troubleshooting

### Backend won't start
- Check that your API key is set in `backend/.env`
- Ensure port 3001 is not in use: `netstat -ano | findstr :3001`
- Check backend logs for errors

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `client/.env.local` has correct API URL
- Look for CORS errors in browser console

### No activities returned
- Verify API key is valid
- Check backend logs for API errors
- Ensure you have web search enabled in your Anthropic account

## Next Steps (Milestone 3)

- [ ] Deploy to production (Vercel + Railway/Render)
- [ ] Add user accounts and saved searches
- [ ] Activity favoriting and sharing
- [ ] Enhanced filtering (price range, category)
- [ ] Map view with pins for all activities
- [ ] Review integration (Google Reviews API)

## License

MIT

## Credits

Built with Claude Code as a learning project for practicing modern web development with TypeScript, React 19, and AI integration.
