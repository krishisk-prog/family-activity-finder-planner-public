# Family Activity Finder & Planner

AI-powered family activity recommendations using Claude API with real-time web search. Find age-appropriate activities, events, and attractions for your family with secure HTTPS access from any device on your network.

## Features

### Core Features
- 🎯 **Smart AI recommendations** based on location, kids' ages, and preferences
- 🗺️ **Dual map integration** - Both Google Maps and Apple Maps directions
- 📱 **Responsive design** - Optimized for mobile, tablet, and desktop
- 🌐 **Real-time web search** - Discovers current events, not just generic venues
- 📍 **Location auto-detection** - Browser geolocation API
- 📅 **Time-sensitive discovery** - Finds seasonal events, exhibitions, and shows happening now

### Event Type Filtering
- 🎃 **Seasonal events** - Pumpkin patches, holiday festivals, summer activities
- 🎨 **Exhibitions** - Museum shows, art galleries, science exhibits
- 🎭 **Shows** - Theater, movies, performances, concerts
- 📚 **Classes** - Workshops, camps, lessons, educational programs
- 🏛️ **Permanent attractions** - Year-round venues and activities

### Performance & Security (Milestone 3)
- 🔒 **HTTPS/SSL** - Secure encrypted connections via mkcert
- 🌍 **LAN accessibility** - Access from any device on your network (phone, tablet, laptop)
- 🏷️ **Friendly domain** - Use `family-activity.local` instead of IP addresses
- 💾 **Response caching** - 10-minute cache reduces API costs and improves speed
- 🛡️ **Input validation** - Comprehensive validation and sanitization
- ⏱️ **Rate limiting** - 10 requests/minute per IP to protect API
- 💰 **Prompt caching** - 90% cost reduction on repeated requests
- 🔄 **Exponential backoff** - Automatic retry on API rate limits
- 📡 **Streaming API** - Prevents timeouts on web search requests

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (Build tool + HTTPS dev server)
- TailwindCSS
- Axios (HTTP client)
- Geolocation API

**Backend:**
- Node.js + Express + TypeScript
- Anthropic Claude API (Sonnet 4.5)
  - Web Search Tool (real-time data)
  - Prompt caching (cost optimization)
  - Streaming responses
- express-rate-limit (Rate limiting)
- In-memory cache (Response caching)

**Security & Infrastructure:**
- HTTPS/SSL (mkcert for local development)
- CORS (Cross-Origin Resource Sharing)
- Input validation & sanitization middleware
- Windows Firewall configuration
- Dynamic API URL detection

## Architecture

For detailed architecture documentation with diagrams, see [ARCHITECTURE.md](./ARCHITECTURE.md)

```
┌──────────────────────────────────────┐
│   Client Devices (HTTPS)             │
│   Browser | Mobile | Tablet          │
└──────────────┬───────────────────────┘
               │ HTTPS (SSL/TLS)
               ▼
┌──────────────────────────────────────┐
│   Frontend (React + Vite)            │
│   Port: 5174 (HTTPS)                 │
│   - Dynamic API detection            │
│   - Responsive UI                    │
└──────────────┬───────────────────────┘
               │ API Calls
               ▼
┌──────────────────────────────────────┐
│   Backend (Node.js + Express)        │
│   Port: 3001 (HTTPS)                 │
│   ├─ CORS                            │
│   ├─ Rate Limiter (10 req/min)      │
│   ├─ Input Validator                 │
│   ├─ Cache Layer (10 min TTL)       │
│   └─ Claude Service                  │
└──────────────┬───────────────────────┘
               │ API Call
               ▼
┌──────────────────────────────────────┐
│   Anthropic Claude API               │
│   (Sonnet 4.5 + Web Search)          │
└──────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Anthropic API key** ([Get one here](https://console.anthropic.com/))
- **Administrator access** (for HTTPS certificate installation)

### 1. Clone and Install

```bash
git clone https://github.com/krishisk-prog/family-activity-finder-planner.git
cd family-activity-finder-planner

# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 2. Install HTTPS Certificates (Required)

**Install mkcert:**

```powershell
# Open PowerShell as Administrator
choco install mkcert

# Install local CA
mkcert -install
```

**Generate certificates:**

```powershell
# Backend certificates
cd backend/certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1 192.168.88.20

# Frontend certificates
cd ../../client/certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1 192.168.88.20
cd ../..
```

**Note:** Replace `192.168.88.20` with your actual WiFi IP address (run `ipconfig` to find it).

### 3. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your API key
```

The `backend/.env` file should contain:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
NODE_ENV=development
USE_HTTPS=true
HOST=0.0.0.0
```

**Frontend (.env.local):**

Already configured with dynamic API URL detection. No changes needed unless you want to override:
```env
# Optional: Override API URL (not recommended, auto-detection works better)
# VITE_API_URL=https://localhost:3001/api
```

### 4. Configure Firewall (Windows)

**Run in PowerShell as Administrator:**

```powershell
# Allow backend port
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3001

# Allow frontend port
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5174
```

### 5. (Optional) Set Up Friendly Domain

Instead of using IP addresses, you can access via `family-activity.local`:

```powershell
# Run as Administrator
.\setup-domain.ps1
```

See [domain-setup-guide.md](./domain-setup-guide.md) for detailed instructions and multi-device setup.

### 6. Run the Application

```bash
# From project root
npm run dev
```

This starts both:
- **Frontend**: https://localhost:5174
- **Backend**: https://localhost:3001

**Access from other devices on your network:**
- Replace `localhost` with your IP (e.g., `https://192.168.88.20:5174`)
- Or use friendly domain: `https://family-activity.local:5174`

## Access URLs

### Local Access (Same Computer)
- **Frontend**: https://localhost:5174
- **Backend**: https://localhost:3001/health

### Network Access (Other Devices)
- **Frontend**: https://[YOUR_IP]:5174 (e.g., https://192.168.88.20:5174)
- **Backend**: https://[YOUR_IP]:3001

### Friendly Domain (After Setup)
- **Frontend**: https://family-activity.local:5174
- **Backend**: https://family-activity.local:3001

**First-time access:** You may see a certificate warning. Click "Advanced" → "Proceed" to accept the self-signed certificate.

## API Documentation

### POST /api/search

Search for family activities with validation and rate limiting.

**Rate Limit:** 10 requests per minute per IP address

**Request:**
```json
{
  "city": "Seattle, WA",                      // Required, 2-100 chars
  "kidsAges": "5, 8",                         // Required, format: "5,8" or "3-7", ages 1-18
  "availability": "Saturday afternoon",        // Required, 3-200 chars
  "maxDistance": "25",                        // Required, 1-500 miles
  "preferences": "outdoor, educational",       // Optional, max 500 chars
  "eventTypes": ["seasonal", "exhibition"]    // Optional, valid enum values
}
```

**Valid Event Types:**
- `seasonal` - Time-limited seasonal events
- `exhibition` - Museum exhibitions, galleries
- `show` - Performances, movies, theater
- `class` - Workshops, lessons, camps
- `permanent` - Year-round attractions

**Response 200 (Success):**
```json
{
  "success": true,
  "cached": false,
  "count": 20,
  "activities": [
    {
      "id": "uuid-here",
      "name": "WildLanterns at Woodland Park Zoo",
      "location": "Woodland Park Zoo",
      "distance": "5 miles from Seattle",
      "description": "A magical lantern festival featuring illuminated animal sculptures...",
      "ageAppropriate": "Perfect for ages 5-8",
      "eventType": "seasonal",
      "cost": "$25 per person",
      "duration": "2-3 hours",
      "reservationRequired": true,
      "googleMapsLink": "https://www.google.com/maps/dir/?api=1&destination=...",
      "appleMapsLink": "https://maps.apple.com/?daddr=..."
    }
  ]
}
```

**Response 400 (Validation Error):**
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "city",
      "message": "City name must be at least 2 characters"
    }
  ]
}
```

**Response 429 (Rate Limit Exceeded):**
```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again in a minute."
}
```

**Response 500 (Server Error):**
```json
{
  "error": "Failed to search activities",
  "message": "Error details..."
}
```

**Response 502 (Claude API Error):**
```json
{
  "error": "Failed to connect to AI service",
  "message": "Please try again in a moment"
}
```

### GET /health

Health check endpoint (no rate limit).

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T12:00:00.000Z",
  "uptime": 3600.5
}
```

## Project Structure

```
family-activity-finder-planner/
├── client/                          # Frontend React app
│   ├── certs/                       # SSL certificates (mkcert)
│   │   ├── localhost.pem
│   │   └── localhost-key.pem
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── SearchForm.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ResultsGrid.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── services/                # API client
│   │   │   └── api.ts               # Dynamic API URL detection
│   │   ├── types/                   # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.local                   # Frontend config (optional)
│   ├── vite.config.ts              # Vite + HTTPS config
│   └── package.json
├── backend/                         # Express API server
│   ├── certs/                       # SSL certificates (mkcert)
│   │   ├── localhost.pem
│   │   └── localhost-key.pem
│   ├── src/
│   │   ├── server.ts                # Express app + HTTPS setup
│   │   ├── routes/
│   │   │   └── search.ts            # Search endpoint + caching
│   │   ├── services/
│   │   │   ├── claudeService.ts     # Claude API integration
│   │   │   ├── activityFormatter.ts # Format activities + map links
│   │   │   └── cacheService.ts      # In-memory cache (NEW)
│   │   └── middleware/
│   │       └── validateSearch.ts    # Input validation (NEW)
│   ├── .env                         # Backend config (not in git)
│   ├── .env.example                 # Template for .env
│   └── package.json
├── ARCHITECTURE.md                  # Detailed architecture docs (NEW)
├── troubleshooting-guide.md        # Issues & fixes guide (NEW)
├── domain-setup-guide.md           # Domain setup instructions (NEW)
├── setup-domain.ps1                 # Domain setup script (NEW)
├── spec.md                          # Technical specification
├── prompt.md                        # Claude API prompt template
├── todo.md                          # Development milestones
├── package.json                     # Root package (runs both servers)
└── README.md                        # This file
```

## Development

### Hot Reload
- **Frontend**: Vite HMR (Hot Module Replacement)
- **Backend**: Nodemon + ts-node

### TypeScript
- Strict mode enabled
- Separate tsconfig for frontend and backend
- Type safety across the stack

### Scripts

**Root:**
```bash
npm run dev          # Start both frontend and backend
npm run dev:client   # Start only frontend
npm run dev:backend  # Start only backend
```

**Backend:**
```bash
npm run dev          # Start with nodemon (hot reload)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript
```

**Client:**
```bash
npm run dev          # Start Vite dev server (HTTPS)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Default | Example |
|----------|----------|-------------|---------|---------|
| `ANTHROPIC_API_KEY` | **Yes** | Your Anthropic API key | - | `sk-ant-xxxxx` |
| `PORT` | No | Backend server port | `3001` | `3001` |
| `NODE_ENV` | No | Environment mode | `development` | `development` |
| `USE_HTTPS` | No | Enable HTTPS | `false` | `true` |
| `HOST` | No | Bind address | `localhost` | `0.0.0.0` |

### Frontend (`client/.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL (auto-detected if not set) | `https://localhost:3001/api` |

**Note:** The frontend automatically detects the correct API URL based on how it's accessed (localhost vs network IP), so you typically don't need to set `VITE_API_URL`.

## Security Features

### Input Validation
All search parameters are validated and sanitized:
- **City**: 2-100 characters, alphanumeric only
- **Kids Ages**: 1-18 years, valid format
- **Distance**: 1-500 miles
- **Event Types**: Must be valid enum values
- **Sanitization**: Removes HTML tags and dangerous characters

### Rate Limiting
- **Limit**: 10 requests per minute per IP address
- **Response**: 429 status code when exceeded
- **Headers**: Standard RateLimit-* headers included
- **Purpose**: Protects against API abuse and excessive costs

### HTTPS/SSL
- **Development**: mkcert self-signed certificates
- **Encryption**: All traffic encrypted in transit
- **Multi-device**: Certificates valid for localhost + network IPs

### CORS
- **Development**: Allows all origins for easier testing
- **Production**: Whitelist specific domains (to be configured)

## Performance Optimizations

### Response Caching
- **Duration**: 10-minute TTL (Time To Live)
- **Storage**: In-memory Map-based cache
- **Cleanup**: Automatic removal of expired entries every 5 minutes
- **Benefit**: Instant results for repeated searches, reduced API costs

### Prompt Caching
- **Benefit**: 90% cost reduction on cache hits
- **Implementation**: System prompt cached by Claude API
- **Duration**: 5-minute cache window

### Streaming API
- **Benefit**: Prevents connection timeouts on long web searches
- **Implementation**: Streaming response from Claude API
- **Progress**: Real-time activity discovery

## Cost Estimates

### Claude API (Sonnet 4.5 with Web Search)
- **Input tokens**: ~$3 per 1M tokens
- **Output tokens**: ~$15 per 1M tokens
- **Cached reads**: ~$0.30 per 1M tokens (90% savings)
- **Estimated per search**: $0.01-0.03 (with caching)

### Monthly Estimates
Based on 500 searches/month with 50% cache hit rate:
- **Without caching**: ~$15-25/month
- **With caching**: ~$5-10/month

## Milestones

- ✅ **Milestone 1:** UI with Dummy Data - COMPLETED
- ✅ **Milestone 2:** Claude API Integration - COMPLETED
- 🚧 **Milestone 3:** Polish & Production Ready - IN PROGRESS
  - ✅ Task 1: HTTPS/SSL with mkcert
  - ✅ Task 2: LAN accessibility
  - ✅ Task 3: Response caching
  - ✅ Task 4: Input validation
  - ✅ Task 5: Rate limiting
  - ⏳ Task 6-8: Frontend enhancements
  - ⏳ Task 9-12: Production deployment

See [todo.md](./todo.md) for detailed task breakdown.

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Comprehensive architecture documentation with diagrams
- **[troubleshooting-guide.md](./troubleshooting-guide.md)** - Common issues and solutions
- **[domain-setup-guide.md](./domain-setup-guide.md)** - Friendly domain setup for all devices
- **[spec.md](./spec.md)** - Technical specification
- **[todo.md](./todo.md)** - Development roadmap

## Troubleshooting

### Certificate Warnings
**Issue:** Browser shows "This Connection Is Not Private"

**Solution:**
- Click "Advanced" → "Proceed to localhost (unsafe)"
- Or install mkcert CA: `mkcert -install`

### Port Already in Use
**Issue:** `EADDRINUSE: address already in use 0.0.0.0:3001`

**Solution:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Can't Access from Other Devices
**Issue:** Works on PC but not on phone/tablet

**Solutions:**
1. **Check firewall rules** (see Setup step 4)
2. **Verify same network**: Both devices must be on same WiFi
3. **Disable VPN**: VPN can interfere with local network access
4. **Use correct IP**: Run `ipconfig` to get your current WiFi IP

### Validation Errors
**Issue:** Getting 400 validation errors

**Solution:**
- Check that all required fields are provided
- Ensure kids ages are in valid format: "5, 8" or "3-7"
- Verify event types are valid: seasonal, exhibition, show, class, permanent

### Rate Limit Errors
**Issue:** Getting 429 rate limit errors

**Solution:**
- Wait 1 minute before retrying
- Reduce request frequency
- Cache is working - repeated searches are instant

For more detailed troubleshooting, see [troubleshooting-guide.md](./troubleshooting-guide.md)

## Testing Checklist

### Backend
- ✅ Server starts on port 3001 (HTTPS)
- ✅ Health endpoint returns status
- ✅ TypeScript compiles without errors
- ✅ Rate limiting works (429 after 10 requests/min)
- ✅ Input validation rejects invalid data (400)
- ✅ Cache returns instant results on repeated searches
- ✅ /api/search endpoint works with Claude API

### Frontend
- ✅ TypeScript compiles without errors
- ✅ Dev server starts on port 5174 (HTTPS)
- ✅ Form with all input fields renders
- ✅ Location auto-detection works
- ✅ Dynamic API URL detection works
- ✅ Responsive design on mobile and desktop
- ✅ Full end-to-end search with backend

### Security
- ✅ HTTPS encryption on all connections
- ✅ Input sanitization removes dangerous characters
- ✅ Rate limiting prevents abuse
- ✅ CORS configured correctly
- ✅ API key protected (not exposed to frontend)

### Network Access
- ✅ Accessible from localhost
- ✅ Accessible from network IP
- ✅ Accessible from friendly domain (if configured)
- ✅ Works on mobile devices (same WiFi)
- ✅ Certificate trusted or bypassable

## Future Enhancements (Post-Milestone 3)

- [ ] **Production deployment** (Vercel + Railway/Render)
- [ ] **User accounts** and authentication
- [ ] **Saved searches** and favorites
- [ ] **Activity sharing** (share results via link)
- [ ] **Enhanced filtering** (price range, indoor/outdoor)
- [ ] **Map view** with activity pins
- [ ] **Reviews integration** (Google Reviews API)
- [ ] **Calendar export** (add events to calendar)
- [ ] **Email notifications** for new events
- [ ] **Mobile app** (React Native)
- [ ] **Redis cache** for multi-instance deployment
- [ ] **Database** for persistent storage
- [ ] **Analytics** and monitoring

## Contributing

This is a personal learning project. If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

Built with Claude Code as a learning project for practicing modern web development with:
- TypeScript full-stack development
- React 19 and modern frontend patterns
- Express.js API design
- AI integration with Claude API
- Security best practices (HTTPS, validation, rate limiting)
- Performance optimization (caching, streaming)

**Learning Resources:**
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Version**: 1.0.0
**Last Updated**: November 26, 2025
**Status**: Milestone 3 - Production Ready (In Progress)
