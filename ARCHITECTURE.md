# Family Activity Finder - Architecture Design

## Table of Contents
- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Caching Strategy](#caching-strategy)
- [API Design](#api-design)
- [Deployment Architecture](#deployment-architecture)

---

## System Overview

The Family Activity Finder is a full-stack web application that helps families discover age-appropriate activities in their area using AI-powered search with real-time web data.

**Key Features:**
- AI-powered activity recommendations using Claude with web search
- Real-time event discovery (seasonal events, exhibitions, shows, classes)
- Age-appropriate filtering for children (1-18 years)
- Distance-based search with configurable radius
- Response caching to minimize API costs
- Rate limiting for API protection
- HTTPS/SSL support for secure local and network access

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     TECHNOLOGY STACK                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend                                                   │
│  ├─ React 18 (TypeScript)                                  │
│  ├─ Vite (Build tool + Dev server)                         │
│  ├─ Tailwind CSS (Styling)                                 │
│  └─ Axios (HTTP client)                                    │
│                                                             │
│  Backend                                                    │
│  ├─ Node.js + Express (TypeScript)                         │
│  ├─ Anthropic Claude API (Sonnet 4.5)                      │
│  │  └─ Web Search Tools (Real-time data)                   │
│  ├─ express-rate-limit (Rate limiting)                     │
│  └─ In-memory cache (Response caching)                     │
│                                                             │
│  Security & Infrastructure                                 │
│  ├─ HTTPS/SSL (mkcert for local development)              │
│  ├─ CORS (Cross-Origin Resource Sharing)                  │
│  ├─ Input validation & sanitization                       │
│  └─ Windows Firewall rules (Network access)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      CLIENT DEVICES                              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Browser   │  │   Mobile    │  │   Tablet    │            │
│  │ (localhost) │  │   (WiFi)    │  │   (WiFi)    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                       │
│                   HTTPS (SSL/TLS)                               │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │     FRONTEND (React + Vite)          │
        │     Port: 5174 (HTTPS)               │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │  Components                    │ │
        │  │  ├─ SearchForm                │ │
        │  │  ├─ ActivityList              │ │
        │  │  └─ ActivityCard              │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │  Services                      │ │
        │  │  └─ API Client (Axios)        │ │
        │  └────────────────────────────────┘ │
        └──────────────┬───────────────────────┘
                       │
                HTTPS API Calls
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │    BACKEND (Node.js + Express)       │
        │    Port: 3001 (HTTPS)                │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │  Middleware Layer              │ │
        │  │  ├─ CORS                       │ │
        │  │  ├─ Rate Limiter (10 req/min) │ │
        │  │  ├─ Input Validator            │ │
        │  │  └─ Request Logger             │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │  Routes                        │ │
        │  │  ├─ /health (Health check)    │ │
        │  │  └─ /api/search (Activity)    │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │  Services                      │ │
        │  │  ├─ Claude Service             │ │
        │  │  ├─ Cache Service              │ │
        │  │  └─ Activity Formatter         │ │
        │  └────────────────────────────────┘ │
        └──────────────┬───────────────────────┘
                       │
                   API Call
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │   ANTHROPIC CLAUDE API               │
        │   (Sonnet 4.5 with Web Search)       │
        │                                      │
        │  Features:                           │
        │  ├─ Natural language processing      │
        │  ├─ Web search tool integration      │
        │  ├─ Prompt caching (cost reduction)  │
        │  └─ Streaming responses              │
        └──────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYERS                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Presentation Layer (React Components)               │ │
│  │                                                       │ │
│  │  App.tsx                                             │ │
│  │    ├─ SearchForm.tsx                                │ │
│  │    │   ├─ City input                                │ │
│  │    │   ├─ Kids ages input                           │ │
│  │    │   ├─ Availability input                        │ │
│  │    │   ├─ Distance selector                         │ │
│  │    │   ├─ Preferences (optional)                    │ │
│  │    │   └─ Event type filters                        │ │
│  │    │                                                 │ │
│  │    └─ ActivityList.tsx                              │ │
│  │        └─ ActivityCard.tsx (repeated)               │ │
│  │            ├─ Activity name & description           │ │
│  │            ├─ Age appropriateness                   │ │
│  │            ├─ Location & distance                   │ │
│  │            ├─ Event type badge                      │ │
│  │            └─ Map links (Google/Apple)              │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  State Management Layer                              │ │
│  │                                                       │ │
│  │  ├─ useState (Form state)                           │ │
│  │  ├─ Loading state                                    │ │
│  │  ├─ Error state                                      │ │
│  │  └─ Activities state                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Service Layer                                        │ │
│  │                                                       │ │
│  │  api.ts                                              │ │
│  │    ├─ getApiBaseUrl() - Dynamic URL detection       │ │
│  │    └─ searchActivities() - POST /api/search         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    BACKEND LAYERS                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Server Layer (server.ts)                            │ │
│  │                                                       │ │
│  │  HTTPS Server (Port 3001)                           │ │
│  │    ├─ SSL Certificate loading                        │ │
│  │    ├─ Network interface detection                    │ │
│  │    └─ Graceful shutdown handlers                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Middleware Chain (Executed in order)                │ │
│  │                                                       │ │
│  │  1. CORS Handler                                     │ │
│  │     └─ Allows all origins in development             │ │
│  │                                                       │ │
│  │  2. JSON Body Parser                                 │ │
│  │     └─ Parses JSON request bodies                    │ │
│  │                                                       │ │
│  │  3. Request Logger                                   │ │
│  │     └─ Logs method, path, headers, body              │ │
│  │                                                       │ │
│  │  4. Rate Limiter (on /api/* routes)                 │ │
│  │     ├─ Window: 1 minute                              │ │
│  │     ├─ Max: 10 requests per IP                       │ │
│  │     └─ Returns: 429 if exceeded                      │ │
│  │                                                       │ │
│  │  5. Input Validator (on /api/search)                │ │
│  │     ├─ Validates all fields                          │ │
│  │     ├─ Sanitizes strings                             │ │
│  │     └─ Returns: 400 if invalid                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Route Handlers                                       │ │
│  │                                                       │ │
│  │  GET  /health        → Health check                  │ │
│  │  POST /api/search    → Activity search               │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Business Logic Layer                                 │ │
│  │                                                       │ │
│  │  claudeService.ts                                    │ │
│  │    ├─ searchActivities()                            │ │
│  │    ├─ buildPrompt() - Constructs AI prompt          │ │
│  │    ├─ callClaudeAPI() - API call with retry         │ │
│  │    └─ parseResponse() - JSON extraction             │ │
│  │                                                       │ │
│  │  activityFormatter.ts                                │ │
│  │    ├─ formatActivities() - Add IDs & links          │ │
│  │    ├─ generateMapLinks() - Google/Apple Maps        │ │
│  │    └─ normalizeDistance() - Format distance         │ │
│  │                                                       │ │
│  │  cacheService.ts                                     │ │
│  │    ├─ CacheService<T> - Generic cache class         │ │
│  │    ├─ get() / set() / has() / delete()              │ │
│  │    ├─ Automatic cleanup (every 5 min)               │ │
│  │    └─ generateCacheKey() - Parameter hashing        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Request Flow Diagram

```
User fills form
     │
     ▼
Frontend validates input
     │
     ▼
POST /api/search (HTTPS)
     │
     ▼
┌────────────────────────────────┐
│  Backend Middleware Chain      │
│                                │
│  1. CORS Check      ✓          │
│  2. Parse JSON      ✓          │
│  3. Log Request     ✓          │
│  4. Rate Limit      ✓ or 429   │
│  5. Validate Input  ✓ or 400   │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│  Search Route Handler          │
│  (routes/search.ts)            │
│                                │
│  Generate cache key            │
│       │                        │
│       ▼                        │
│  Check cache?                  │
│       ├─ HIT  → Return cached  │
│       │         data (fast)    │
│       │                        │
│       └─ MISS → Continue       │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│  Claude Service                │
│  (services/claudeService.ts)   │
│                                │
│  1. Build AI prompt            │
│  2. Add date context           │
│  3. Call Claude API            │
│     ├─ Web search enabled      │
│     ├─ Prompt caching          │
│     └─ Streaming response      │
│  4. Parse JSON response        │
│  5. Validate activity format   │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│  Activity Formatter            │
│  (services/activityFormatter)  │
│                                │
│  1. Generate unique IDs        │
│  2. Add map links              │
│  3. Format distances           │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│  Cache & Return                │
│                                │
│  1. Store in cache (10 min)   │
│  2. Return JSON response       │
│     {                          │
│       success: true,           │
│       cached: false,           │
│       count: 20,               │
│       activities: [...]        │
│     }                          │
└────────────────────────────────┘
     │
     ▼
Frontend receives activities
     │
     ▼
Display in UI
```

### Data Models

```typescript
// Frontend → Backend (Request)
interface SearchRequest {
  city: string;              // "Seattle, WA"
  kidsAges: string;          // "5, 8" or "3-7"
  availability: string;      // "This weekend"
  maxDistance: string;       // "25"
  preferences?: string;      // "outdoor activities"
  eventTypes?: EventType[];  // ["seasonal", "exhibition"]
}

// Backend Internal (Claude API)
interface SearchParams {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
  eventTypes?: EventType[];
}

// Claude API → Backend (Response)
interface ClaudeActivity {
  name: string;
  location: string;
  distance: string;
  description: string;
  ageAppropriate: string;
  eventType: EventType;
  cost?: string;
  duration?: string;
  reservationRequired?: boolean;
}

// Backend → Frontend (Response)
interface FormattedActivity extends ClaudeActivity {
  id: string;               // Generated UUID
  googleMapsLink: string;   // Generated URL
  appleMapsLink: string;    // Generated URL
}

// Event Types Enum
type EventType =
  | "seasonal"     // Time-limited seasonal events
  | "exhibition"   // Museum exhibitions, galleries
  | "show"        // Performances, movies, theater
  | "class"       // Workshops, lessons, camps
  | "permanent";  // Year-round attractions
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Layer 1: Network Security                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ├─ HTTPS/SSL (mkcert certificates)                  │ │
│  │  │   └─ Encrypts all traffic in transit              │ │
│  │  │                                                    │ │
│  │  ├─ Windows Firewall Rules                           │ │
│  │  │   ├─ Allow port 3001 (Backend)                    │ │
│  │  │   └─ Allow port 5174 (Frontend)                   │ │
│  │  │                                                    │ │
│  │  └─ CORS Configuration                               │ │
│  │      ├─ Development: Allow all origins               │ │
│  │      └─ Production: Whitelist specific domains       │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  Layer 2: Rate Limiting                                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  express-rate-limit                                  │ │
│  │    ├─ Window: 1 minute                               │ │
│  │    ├─ Max requests: 10 per IP                        │ │
│  │    ├─ Response: 429 Too Many Requests                │ │
│  │    └─ Headers: RateLimit-* standards                 │ │
│  │                                                       │ │
│  │  Purpose: Prevent abuse & protect API costs          │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  Layer 3: Input Validation & Sanitization                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  validateSearch.ts middleware                        │ │
│  │                                                       │ │
│  │  City Validation:                                    │ │
│  │    ├─ Required, 2-100 chars                          │ │
│  │    ├─ Regex: /^[a-zA-Z\s,.-]+$/                     │ │
│  │    └─ Sanitize: Remove <, >, special chars          │ │
│  │                                                       │ │
│  │  Kids Ages Validation:                               │ │
│  │    ├─ Required, format: "5,8" or "3-7"              │ │
│  │    ├─ Range: 1-18 years                             │ │
│  │    └─ Parse & validate numeric values               │ │
│  │                                                       │ │
│  │  Max Distance:                                       │ │
│  │    ├─ Required, numeric                              │ │
│  │    └─ Range: 1-500 miles                            │ │
│  │                                                       │ │
│  │  Event Types:                                        │ │
│  │    ├─ Optional, array                                │ │
│  │    └─ Must be valid enum values                     │ │
│  │                                                       │ │
│  │  Prevents: SQL injection, XSS, command injection    │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  Layer 4: API Key Protection                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ├─ Environment variables (.env file)                │ │
│  │  │   └─ ANTHROPIC_API_KEY (never committed to git)  │ │
│  │  │                                                    │ │
│  │  ├─ .gitignore excludes .env                         │ │
│  │  │                                                    │ │
│  │  └─ Logged as masked (sk-ant-api03-dU...)           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Caching Strategy

```
┌────────────────────────────────────────────────────────────┐
│              IN-MEMORY CACHE ARCHITECTURE                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Cache Structure: Map<string, CacheEntry<T>>              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Cache Entry                                          │ │
│  │                                                       │ │
│  │  {                                                    │ │
│  │    key: "hash_of_search_params",                     │ │
│  │    data: FormattedActivity[],                        │ │
│  │    timestamp: 1732658400000,                         │ │
│  │    expiresAt: 1732659000000  // +10 min             │ │
│  │  }                                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Cache Key Generation                                 │ │
│  │                                                       │ │
│  │  Input: {                                            │ │
│  │    city: "Seattle, WA",                              │ │
│  │    kidsAges: "5, 8",                                 │ │
│  │    availability: "This Weekend",                     │ │
│  │    maxDistance: "25",                                │ │
│  │    preferences: "outdoor",                           │ │
│  │    eventTypes: ["seasonal", "exhibition"]            │ │
│  │  }                                                    │ │
│  │                                                       │ │
│  │  Normalization:                                       │ │
│  │    ├─ Lowercase all strings                          │ │
│  │    ├─ Trim whitespace                                │ │
│  │    ├─ Sort arrays                                    │ │
│  │    └─ JSON.stringify()                               │ │
│  │                                                       │ │
│  │  Result: Consistent hash for same parameters         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Cache Lifecycle                                      │ │
│  │                                                       │ │
│  │  Request arrives                                      │ │
│  │       │                                               │ │
│  │       ├─ Generate cache key                          │ │
│  │       ├─ Check if exists                             │ │
│  │       │                                               │ │
│  │       ├─ CACHE HIT                                   │ │
│  │       │   ├─ Check if expired                        │ │
│  │       │   │   ├─ Not expired → Return data           │ │
│  │       │   │   └─ Expired → Delete & MISS             │ │
│  │       │                                               │ │
│  │       └─ CACHE MISS                                  │ │
│  │           ├─ Call Claude API                         │ │
│  │           ├─ Format response                         │ │
│  │           ├─ Store in cache (TTL: 10 min)           │ │
│  │           └─ Return data                             │ │
│  │                                                       │ │
│  │  Background cleanup (every 5 minutes):               │ │
│  │    ├─ Iterate all entries                            │ │
│  │    ├─ Delete expired entries                         │ │
│  │    └─ Log cleanup stats                              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Benefits:                                                │
│    ├─ Reduces API calls to Claude (cost savings)         │
│    ├─ Faster response times (no API latency)             │
│    ├─ Reduces load on Claude API                         │
│    └─ Same search = instant results                      │
│                                                            │
│  Trade-offs:                                              │
│    ├─ Memory usage (limited by process)                  │
│    ├─ Data staleness (10-minute window)                  │
│    └─ Not shared across server instances                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## API Design

### Endpoints

```
┌────────────────────────────────────────────────────────────┐
│                     API ENDPOINTS                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  GET /health                                              │
│  ───────────                                              │
│  Purpose: Health check for monitoring                     │
│  Auth: None                                               │
│  Rate limit: No                                           │
│                                                            │
│  Response 200:                                            │
│  {                                                         │
│    "status": "ok",                                        │
│    "timestamp": "2025-11-26T12:00:00.000Z",              │
│    "uptime": 3600.5                                       │
│  }                                                         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  POST /api/search                                         │
│  ─────────────────                                        │
│  Purpose: Search for family activities                    │
│  Auth: None (rate limited)                                │
│  Rate limit: 10 requests/minute per IP                    │
│  Middleware: Validation + sanitization                    │
│                                                            │
│  Request Body:                                            │
│  {                                                         │
│    "city": "Seattle, WA",           // Required          │
│    "kidsAges": "5, 8",              // Required          │
│    "availability": "This weekend",   // Required          │
│    "maxDistance": "25",             // Required          │
│    "preferences": "outdoor",         // Optional          │
│    "eventTypes": ["seasonal"]        // Optional          │
│  }                                                         │
│                                                            │
│  Response 200 (Success):                                  │
│  {                                                         │
│    "success": true,                                       │
│    "cached": false,                                       │
│    "count": 20,                                           │
│    "activities": [                                        │
│      {                                                    │
│        "id": "uuid-here",                                │
│        "name": "Pumpkin Patch Adventure",                │
│        "location": "Remlinger Farms",                    │
│        "distance": "15 miles from Seattle",              │
│        "description": "...",                             │
│        "ageAppropriate": "Perfect for ages 5-8",        │
│        "eventType": "seasonal",                          │
│        "cost": "$15 per child",                          │
│        "duration": "2-3 hours",                          │
│        "reservationRequired": false,                     │
│        "googleMapsLink": "https://...",                  │
│        "appleMapsLink": "https://..."                    │
│      }                                                    │
│    ]                                                      │
│  }                                                         │
│                                                            │
│  Response 400 (Validation Error):                         │
│  {                                                         │
│    "error": "Validation failed",                          │
│    "errors": [                                            │
│      {                                                    │
│        "field": "city",                                   │
│        "message": "City is required"                      │
│      }                                                    │
│    ]                                                      │
│  }                                                         │
│                                                            │
│  Response 429 (Rate Limit):                               │
│  {                                                         │
│    "error": "Too many requests",                          │
│    "message": "Please try again in a minute"              │
│  }                                                         │
│                                                            │
│  Response 500 (Server Error):                             │
│  {                                                         │
│    "error": "Failed to search activities",                │
│    "message": "Error details..."                          │
│  }                                                         │
│                                                            │
│  Response 502 (Claude API Error):                         │
│  {                                                         │
│    "error": "Failed to connect to AI service",            │
│    "message": "Please try again in a moment"              │
│  }                                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Environment

```
┌────────────────────────────────────────────────────────────┐
│           DEVELOPMENT DEPLOYMENT (Windows PC)              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Local Network: 192.168.88.0/24                           │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Windows PC (192.168.88.36)                          │ │
│  │                                                       │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  Frontend (Vite Dev Server)                    │  │ │
│  │  │  Port: 5174                                     │  │ │
│  │  │  Protocol: HTTPS (mkcert)                       │  │ │
│  │  │  Bind: 0.0.0.0 (all interfaces)                │  │ │
│  │  │                                                  │  │ │
│  │  │  URLs:                                          │  │ │
│  │  │    - https://localhost:5174                     │  │ │
│  │  │    - https://192.168.88.36:5174                │  │ │
│  │  │    - https://family-activity.local:5174        │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                       │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  Backend (Node.js/Express)                     │  │ │
│  │  │  Port: 3001                                     │  │ │
│  │  │  Protocol: HTTPS (mkcert)                       │  │ │
│  │  │  Bind: 0.0.0.0 (all interfaces)                │  │ │
│  │  │                                                  │  │ │
│  │  │  URLs:                                          │  │ │
│  │  │    - https://localhost:3001                     │  │ │
│  │  │    - https://192.168.88.36:3001                │  │ │
│  │  │    - https://family-activity.local:3001        │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                       │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  Windows Firewall                              │  │ │
│  │  │    ├─ Inbound: Port 3001 (Node.js)             │  │ │
│  │  │    └─ Inbound: Port 5174 (Vite)                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                       │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  SSL Certificates (mkcert)                     │  │ │
│  │  │    ├─ backend/certs/localhost.pem              │  │ │
│  │  │    ├─ backend/certs/localhost-key.pem          │  │ │
│  │  │    ├─ client/certs/localhost.pem               │  │ │
│  │  │    └─ client/certs/localhost-key.pem           │  │ │
│  │  │                                                  │  │ │
│  │  │  Valid for:                                     │  │ │
│  │  │    - localhost                                  │  │ │
│  │  │    - 127.0.0.1                                  │  │ │
│  │  │    - family-activity.local                     │  │ │
│  │  │    - 192.168.88.36                             │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Network Devices (WiFi connected)                    │ │
│  │                                                       │ │
│  │  ├─ iPhone/iPad                                      │ │
│  │  ├─ Android phones/tablets                           │ │
│  │  ├─ Other Windows PCs                                │ │
│  │  └─ Mac computers                                    │ │
│  │                                                       │ │
│  │  Access via: https://family-activity.local:5174     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Production Environment (Planned)

```
┌────────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT (Planned)               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Frontend (Vercel)                                    │ │
│  │                                                       │ │
│  │  ├─ Static site hosting                              │ │
│  │  ├─ CDN distribution                                 │ │
│  │  ├─ Automatic HTTPS                                  │ │
│  │  └─ Git-based deployment                             │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Backend (Railway/Heroku)                            │ │
│  │                                                       │ │
│  │  ├─ Node.js container                                │ │
│  │  ├─ Environment variables                            │ │
│  │  ├─ Auto-scaling                                     │ │
│  │  └─ Health monitoring                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  External Services                                    │ │
│  │                                                       │ │
│  │  ├─ Anthropic Claude API                             │ │
│  │  ├─ Optional: Redis (distributed cache)             │ │
│  │  └─ Optional: Monitoring (Sentry, LogRocket)        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

### 1. **TypeScript Throughout**
- **Decision**: Use TypeScript for both frontend and backend
- **Rationale**: Type safety prevents runtime errors, better IDE support
- **Trade-off**: Slightly more verbose, compilation step required

### 2. **In-Memory Caching vs. Redis**
- **Decision**: In-memory Map-based cache
- **Rationale**: Simpler setup, no external dependencies, sufficient for single-instance
- **Trade-off**: Not shared across instances, lost on restart
- **Future**: Consider Redis for multi-instance production deployment

### 3. **Claude API with Web Search**
- **Decision**: Use Claude's built-in web search tools
- **Rationale**: Real-time event data, no need for separate scraping/APIs
- **Trade-off**: API costs, potential latency
- **Mitigation**: Caching, prompt caching, rate limiting

### 4. **Monorepo Structure**
- **Decision**: Separate client/ and backend/ directories
- **Rationale**: Clear separation, independent deployment
- **Trade-off**: Slight duplication (types, configs)

### 5. **HTTPS in Development**
- **Decision**: Use mkcert for local SSL certificates
- **Rationale**: Test production-like environment, secure LAN access
- **Trade-off**: Setup complexity, certificate trust issues on mobile

### 6. **Rate Limiting Strategy**
- **Decision**: 10 requests/minute per IP
- **Rationale**: Balance usability with API cost protection
- **Consideration**: May need adjustment based on usage patterns

### 7. **Validation Architecture**
- **Decision**: Middleware-based validation
- **Rationale**: Reusable, separates validation from business logic
- **Benefit**: Easy to test, maintain, and extend

---

## Performance Considerations

```
┌────────────────────────────────────────────────────────────┐
│                  PERFORMANCE OPTIMIZATIONS                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Cache Layer                                              │
│    ├─ Cache hit: ~5ms response time                       │
│    └─ Cache miss: ~3-8s (Claude API call)                 │
│                                                            │
│  Claude API                                               │
│    ├─ Streaming responses (progressive results)           │
│    ├─ Prompt caching (50% cost reduction on repeats)     │
│    └─ Web search tool (real-time data)                    │
│                                                            │
│  Network                                                  │
│    ├─ HTTPS/SSL overhead: minimal with keep-alive        │
│    ├─ LAN latency: <1ms                                   │
│    └─ Internet latency: 50-200ms to Claude API           │
│                                                            │
│  Future Optimizations                                     │
│    ├─ Redis for distributed caching                       │
│    ├─ CDN for frontend assets                            │
│    ├─ Database for persistent storage                     │
│    └─ WebSocket for real-time updates                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Error Handling Strategy

```
Frontend
  ├─ Network errors → User-friendly message + retry
  ├─ Validation errors → Inline field errors
  └─ API errors → Error state with details

Backend
  ├─ Input validation → 400 with specific field errors
  ├─ Rate limiting → 429 with retry-after info
  ├─ Claude API errors → 502 with generic message
  ├─ Parsing errors → 500 with logged details
  └─ Uncaught exceptions → Logged + graceful shutdown
```

---

## Monitoring & Logging

```
Current Logging (Console)
  ├─ Request logs (method, path, headers, body)
  ├─ Cache stats (hits, misses, size)
  ├─ Rate limit violations
  ├─ Validation failures
  ├─ Claude API calls (timing, token usage)
  └─ Error stack traces

Future Enhancements
  ├─ Structured logging (Winston, Pino)
  ├─ Log aggregation (ELK, DataDog)
  ├─ Error tracking (Sentry)
  ├─ Performance monitoring (New Relic)
  └─ User analytics (Google Analytics, Mixpanel)
```

---

## Scalability Roadmap

```
Phase 1: Current (Single Instance)
  ├─ In-memory cache
  ├─ Single Node.js process
  └─ Development-focused

Phase 2: Production (Multi-Instance)
  ├─ Redis for shared caching
  ├─ Load balancer
  ├─ Horizontal scaling (multiple instances)
  └─ Database for persistent data

Phase 3: Enterprise (Distributed)
  ├─ Microservices architecture
  ├─ Message queue (RabbitMQ, Kafka)
  ├─ Separate search service
  └─ Analytics pipeline
```

---

**Document Version**: 1.0
**Last Updated**: November 26, 2025
**Project**: Family Activity Finder & Planner
