# Milestones Reference - Family Activity Finder

This document contains the complete specifications for all three project milestones. For active tasks, see [todo.md](./todo.md). For completed work, see [CHANGELOG.md](./CHANGELOG.md).

---

## Table of Contents
- [Milestone 1: UI with Dummy Data](#milestone-1-ui-with-dummy-data)
- [Milestone 2: Claude API Integration](#milestone-2-claude-api-integration)
- [Milestone 3: Polish & Production Ready](#milestone-3-polish--production-ready)

---

# Milestone 1: UI with Dummy Data

**Goal:** Build a functional frontend with hardcoded activities (4-6 hours)
**Status:** ✅ COMPLETED

## Overview
Create a React + TypeScript + Vite + TailwindCSS project with a working UI that displays dummy activity data.

## Tasks

### Setup Tasks

#### Task 1: Create React Project with Vite
**Time:** 15 minutes

1. `npm create vite@latest family-activity-finder -- --template react-ts`
2. Install dependencies
3. Test dev server

**Acceptance Criteria:**
- Vite dev server runs on http://localhost:5173
- Default React app displays
- No errors in console

---

#### Task 2: Install and Configure TailwindCSS
**Time:** 15 minutes

1. `npm install -D tailwindcss postcss autoprefixer`
2. `npx tailwindcss init -p`
3. Configure `tailwind.config.js`
4. Update `src/index.css` with Tailwind directives

**Acceptance Criteria:**
- Tailwind CSS classes work
- Custom colors (primary, success) work
- No build errors

---

#### Task 3: Clean Up Boilerplate
**Time:** 10 minutes

1. Delete default files
2. Clear default content
3. Update page title

**Acceptance Criteria:**
- Clean slate for new components
- Browser tab shows "Family Activity Finder"

---

### Component Development

#### Task 4: Create SearchForm Component
**Time:** 2 hours (includes geolocation feature)

**File:** `src/components/SearchForm.tsx`

**5 Input Fields:**
1. **City** - Text input with auto-detection
   - Auto-fills on page load using Navigator Geolocation API
   - Falls back to IP-based geolocation if GPS denied
   - Shows loading state while detecting
   - User can manually edit
2. **Kids Ages** - Text input (e.g., "5, 8" or "3-7")
3. **Availability** - Text input (e.g., "Saturday afternoon")
4. **Max Distance** - Number input (miles)
5. **Preferences** - Textarea (optional)

**Geolocation Implementation:**
- Use `useEffect` hook on component mount
- Try GPS geolocation first
- Use BigDataCloud API for reverse geocoding (GPS → city name)
- If GPS fails, fallback to IP-based geolocation
- Show loading/success/error messages
- Allow manual override

**Acceptance Criteria:**
- All 5 inputs render correctly
- City field auto-detects location on page load
- GPS geolocation works when permission granted
- IP fallback works when GPS denied
- Form validates required fields
- Responsive on mobile and desktop
- Accessible (labels, aria-labels)

---

#### Task 5: Create ActivityCard Component
**Time:** 45 minutes

**File:** `src/components/ActivityCard.tsx`

**Display:**
- Emoji (text-4xl)
- Title (bold, text-lg)
- Links (website, directions)
- Description (2-4 sentences)

**Styling:**
- White background with shadow
- Rounded corners
- Hover: elevation increase
- Primary blue links

**Acceptance Criteria:**
- Card displays all activity data
- Links are clickable and styled
- Hover effect works smoothly
- Responsive layout

---

#### Task 6: Create ResultsGrid Component
**Time:** 30 minutes

**File:** `src/components/ResultsGrid.tsx`

**Layout:**
- 1 column on mobile (<768px)
- 2 columns on tablet (768px-1024px)
- 3 columns on desktop (>1024px)
- Header showing result count

**Acceptance Criteria:**
- Displays all 20 activities
- Responsive grid layout
- Proper spacing between cards

---

#### Task 7: Create LoadingState Component
**Time:** 20 minutes

**File:** `src/components/LoadingState.tsx`

**Options:**
- Spinner with text, or
- Skeleton cards with pulsing animation

**Acceptance Criteria:**
- Loading animation displays
- Centered on screen
- Friendly message shows

---

### Dummy Data & Integration

#### Task 8: Create Dummy Data
**Time:** 30 minutes

**File:** `src/data/dummyActivities.ts`

**Requirements:**
- 20 hardcoded Activity objects
- Realistic Seattle-based examples
- Variety of activity types

**Activity Types:**
- Zoos/aquariums (🦁, 🐠)
- Museums (🎨, 🔬)
- Parks/playgrounds (🌳, 🎠)
- Indoor play (🎪, 🧩)
- Libraries (📚)
- Sports (⚽, 🏊)
- Entertainment (🎬, 🎭)
- Food (🍕, 🍦)

**Acceptance Criteria:**
- 20 diverse activities
- All fields populated
- Realistic descriptions (2-4 sentences)

---

#### Task 9: Implement Google Maps Link Generator
**Time:** 20 minutes

**File:** `src/utils/mapLinks.ts`

```typescript
export function generateMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}`;
}
```

**Acceptance Criteria:**
- Function generates valid Google Maps URLs
- Links open in new tab and show directions
- Encoding handles special characters

---

#### Task 10: Wire Up App.tsx
**Time:** 30 minutes

**State Management:**
- activities, isLoading, hasSearched

**Flow:**
1. Show SearchForm
2. On submit → Show LoadingState (1-2 seconds)
3. After delay → Show ResultsGrid with dummy data

**Acceptance Criteria:**
- Form submission triggers loading state
- After 1-2 seconds, shows 20 dummy activities
- Can search again (results update)
- No errors in console

---

### Styling & Polish

#### Task 11: Add Responsive Layout
**Time:** 20 minutes

**Layout:**
- Container: max-w-7xl, centered
- Padding: px-4 on mobile, px-8 on desktop
- SearchForm: max-w-2xl, centered

**Acceptance Criteria:**
- Looks good on mobile (375px)
- Looks good on tablet (768px)
- Looks good on desktop (1440px)
- No horizontal scroll

---

#### Task 12: Add Header & Branding
**Time:** 15 minutes

**Content:**
- Title: "Family Activity Finder"
- Tagline: "Discover perfect activities for your family"
- Optional: Simple icon/emoji

**Acceptance Criteria:**
- Header displays at top
- Branded and professional
- Responsive text sizes

---

#### Task 13: Test & Fix Bugs
**Time:** 30 minutes

**Testing Checklist:**
- Form validation works
- Required fields show errors
- Submit button disabled when invalid
- Loading state shows/hides correctly
- All 20 activities display
- Cards look good (no layout breaks)
- Links work (open in new tab)
- Mobile responsive
- Desktop responsive
- No console errors
- No TypeScript errors

---

## Time Breakdown

| Task | Time |
|------|------|
| Setup (1-3) | 40 min |
| SearchForm (4) | 2 hours |
| ActivityCard (5) | 45 min |
| ResultsGrid (6) | 30 min |
| LoadingState (7) | 20 min |
| Dummy Data (8) | 30 min |
| Maps Generator (9) | 20 min |
| Wire Up App (10) | 30 min |
| Responsive (11) | 20 min |
| Header (12) | 15 min |
| Testing (13) | 30 min |
| **TOTAL** | **~6-7 hours** |

---

# Milestone 2: Claude API Integration

**Goal:** Backend Integration with Claude API (8-10 hours)
**Status:** ✅ COMPLETED

## Overview
Replace dummy data with real AI-powered activity search using Claude API with web search enabled.

## Tasks

### Backend Setup

#### Task 1: Initialize Backend Project
**Time:** 30 minutes

1. Create `backend/` directory
2. `npm init -y`
3. Install dependencies:
   ```bash
   npm install express @anthropic-ai/sdk cors dotenv
   npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
   ```
4. Initialize TypeScript: `npx tsc --init`
5. Create folder structure:
   ```
   backend/
   ├── src/
   │   ├── server.ts
   │   ├── routes/
   │   ├── services/
   │   └── types/
   ├── .env
   ├── .gitignore
   └── package.json
   ```

**Acceptance Criteria:**
- Backend folder structure created
- All dependencies installed
- TypeScript configured
- Dev script runs without errors

---

#### Task 2: Create Express Server
**Time:** 45 minutes

**File:** `backend/src/server.ts`

**Requirements:**
- Express server with CORS
- Health check endpoint
- Environment variables
- Error handling middleware
- Request logging

**Acceptance Criteria:**
- Server starts on port 3001
- Health check returns JSON
- CORS properly configured
- Request logging works
- Error handling catches errors

---

#### Task 3: Set Up Anthropic API Configuration
**Time:** 20 minutes

**Files:** `backend/.env`, `backend/.env.example`

**Environment Variables:**
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

**Acceptance Criteria:**
- .env file created with API key
- .env.example created
- .env excluded from git
- Can access API key in code
- API key is valid

---

### Claude API Integration

#### Task 4: Create Claude Service
**Time:** 2 hours

**File:** `backend/src/services/claudeService.ts`

**Requirements:**
- Initialize Anthropic SDK
- Build prompt from prompt.md template
- Enable web_search_20250305 tool
- Parse JSON from response
- Comprehensive error handling

**Key Implementation:**
```typescript
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }],
  tools: [
    {
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 15,
    },
  ],
});
```

**Acceptance Criteria:**
- Anthropic SDK properly initialized
- Prompt uses all 5 input parameters
- Web search tool enabled
- JSON parsing handles response
- Validates all required fields
- Error handling for API failures
- Error handling for invalid JSON
- Logs errors for debugging

---

#### Task 5: Create Activity Formatter Service
**Time:** 30 minutes

**File:** `backend/src/services/activityFormatter.ts`

**Requirements:**
- Add Google Maps links
- Add Apple Maps links
- Add unique IDs
- URL encoding for addresses

**Acceptance Criteria:**
- IDs assigned sequentially
- Google Maps links generated correctly
- Apple Maps links generated correctly
- URL encoding handles special characters
- All fields preserved

---

#### Task 6: Create Search API Route
**Time:** 45 minutes

**File:** `backend/src/routes/search.ts`

**Requirements:**
- POST /api/search endpoint
- Request validation
- Call Claude service
- Format response with map links
- Error handling (400, 500, 502)

**Acceptance Criteria:**
- POST /api/search works
- Validates required fields
- Validates field types
- Returns 400 for missing/invalid fields
- Calls Claude service successfully
- Formats activities with map links
- Error responses are informative

---

### Frontend Integration

#### Task 7: Create API Service in Frontend
**Time:** 30 minutes

**File:** `client/src/services/api.ts`

**Requirements:**
- Fetch function to call backend
- TypeScript type safety
- Error handling
- Environment-aware API URL

**Acceptance Criteria:**
- API service makes POST requests
- TypeScript types are correct
- Handles network errors
- Handles API errors (400, 500)
- Uses environment variable for URL
- Returns typed Activity[] array

---

#### Task 8: Update App.tsx to Use Real API
**Time:** 30 minutes

**Requirements:**
- Replace dummy data with API call
- Add error state
- Handle loading state
- Display errors to user

**Acceptance Criteria:**
- Removed dummy data import
- Uses searchActivities from api.ts
- Error state displays when API fails
- Loading state shows during API call
- Activities display after success
- Can retry after error

---

#### Task 9: Add Error Display Component
**Time:** 20 minutes

**File:** `client/src/components/ErrorState.tsx`

**Requirements:**
- Display error message
- Retry button
- Consistent styling

**Acceptance Criteria:**
- Error icon displays
- Message is user-friendly
- Retry button works
- Consistent styling with app

---

### Development Experience

#### Task 10: Set Up Concurrent Development
**Time:** 15 minutes

**Requirements:**
- Run frontend and backend with one command
- Both servers hot-reload
- Clear console output

**Root package.json scripts:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd client && npm run dev",
    "dev:backend": "cd backend && npm run dev"
  }
}
```

**Acceptance Criteria:**
- `npm run dev` starts both servers
- Frontend runs on port 5174
- Backend runs on port 3001
- Hot reload works for both

---

### Testing & Polish

#### Task 11: End-to-End Testing
**Time:** 1 hour

**Backend Tests:**
- Backend starts without errors
- Health check returns 200
- Can call /api/search with valid data
- Returns 400 for missing fields
- Claude API returns 20 activities
- Activities have all required fields
- Map links generated correctly

**Frontend Tests:**
- Form submits to backend
- Loading state shows during API call
- Activities display after search
- All 20 activities render
- Google Maps links work
- Apple Maps links work
- Website links work
- Error displays when backend offline
- Retry button works
- Can perform multiple searches

---

#### Task 12: Add Response Caching (Optional)
**Time:** 45 minutes

**File:** `backend/src/services/cacheService.ts`

**Requirements:**
- Cache identical searches
- 10-minute TTL
- Reduce API costs

**Acceptance Criteria:**
- Identical searches use cached data
- Cache expires after 10 minutes
- Cache key includes all params
- Cached response includes "cached: true"

---

#### Task 13: Documentation & README Updates
**Time:** 30 minutes

**Files:** `README.md`, `backend/README.md`

**Content:**
- Complete setup instructions
- Environment variable documentation
- API endpoint documentation
- Architecture diagram

---

## Time Breakdown

| Category | Time |
|----------|------|
| Backend Setup | 1h 35min |
| Claude Integration | 3h 15min |
| Frontend Updates | 1h 20min |
| Dev Experience | 15min |
| Testing | 1h |
| Caching (Optional) | 45min |
| Documentation | 30min |
| **Total** | **8-10 hours** |

---

# Milestone 3: Polish & Production Ready

**Goal:** Production-ready application (8-10 hours)
**Status:** 🚧 IN PROGRESS (Tasks 1-5 completed, Tasks 6-12 remaining)

## Overview
Polish the application for production deployment with security, performance, and UX enhancements.

## Tasks

### Development Environment

#### Task 1: SSL/HTTPS for Local Development ✅
**Time:** 30 minutes
**Status:** COMPLETED

**Requirements:**
- Generate self-signed SSL certificates (mkcert)
- Configure Express for HTTPS
- Configure Vite dev server for HTTPS
- Update API URLs to use `https://`

**Why SSL in Development?**
- Mirrors production environment
- Required for browser APIs (geolocation, service workers)
- Catches mixed-content issues early
- Security best practices

**Acceptance Criteria:**
- Local certificates generated with mkcert
- Backend serves on https://localhost:3001
- Frontend serves on https://localhost:5174
- No browser security warnings

---

#### Task 2: LAN Network Accessibility ✅
**Time:** 20 minutes
**Status:** COMPLETED

**Requirements:**
- Bind servers to `0.0.0.0` (all network interfaces)
- Display local IP address on startup
- Configure CORS for LAN access
- Update npm scripts with `--host` flag
- Dynamic API URL detection for frontend

**Why LAN Accessibility?**
- Test on mobile devices on same WiFi
- Share with team members locally
- Test cross-device compatibility
- No deployment needed for demos

**Acceptance Criteria:**
- Backend accessible from other LAN devices
- Frontend accessible from other LAN devices
- Local IP displayed on startup
- CORS allows LAN IP origins
- Mobile device can access the app
- Friendly domain support (family-activity.local)

---

### Backend Polish

#### Task 3: Response Caching ✅
**Time:** 45 minutes
**Status:** COMPLETED

**File:** `backend/src/services/cacheService.ts`

**Requirements:**
- Cache identical searches
- 10-minute TTL
- Cache key based on all search parameters
- Return cached response with `cached: true`

**Acceptance Criteria:**
- Identical searches return cached data
- Cache expires after 10 minutes
- Cached responses marked with flag
- Generic CacheService<T> class
- Cache stats logging

---

#### Task 4: Input Validation & Sanitization ✅
**Time:** 30 minutes
**Status:** COMPLETED

**File:** `backend/src/middleware/validateSearch.ts`

**Requirements:**
- Validate city name format
- Parse and validate kids ages
- Enforce max distance limits (1-500 miles)
- Sanitize text inputs
- Validate event types

**Acceptance Criteria:**
- Invalid city names rejected
- Ages parsed correctly
- Distance limited to range
- Special characters sanitized
- Event types validated
- Field-specific error messages

---

#### Task 5: Rate Limiting ✅
**Time:** 30 minutes
**Status:** COMPLETED

**File:** `backend/src/server.ts`

**Requirements:**
- Limit requests per IP
- 10 requests per minute per IP
- Return 429 with retry-after header

**Acceptance Criteria:**
- Rate limit enforced per IP
- 429 response with clear message
- Standard RateLimit-* headers
- Doesn't affect health endpoint
- Applied globally to /api routes

---

### Frontend Polish

#### Task 6: Enhanced Loading UX ⏳
**Time:** 30 minutes
**Status:** NOT STARTED

**File:** `client/src/components/LoadingState.tsx`

**Requirements:**
- Skeleton cards instead of spinner
- Progress indicator
- Estimated time remaining

**Acceptance Criteria:**
- Skeleton cards show during loading
- Progress messages update
- Smooth transition to results

---

#### Task 7: Save Search to LocalStorage ⏳
**Time:** 30 minutes
**Status:** NOT STARTED

**Files:** `client/src/components/SearchForm.tsx`, `client/src/hooks/useLocalStorage.ts`

**Requirements:**
- Remember last search parameters
- Pre-fill form on page load
- Clear button to reset

**Acceptance Criteria:**
- Form pre-fills with last search
- Persists across browser sessions
- Clear button works

---

#### Task 8: Improve Mobile Experience ⏳
**Time:** 30 minutes
**Status:** NOT STARTED

**Requirements:**
- Touch-friendly buttons (min 44px)
- Better spacing on small screens
- Collapsible form on results view

**Acceptance Criteria:**
- Buttons are at least 44px touch target
- Form collapses after search on mobile
- No horizontal scroll issues

---

### Deployment

#### Task 9: Deploy Frontend to Vercel ⏳
**Time:** 30 minutes
**Status:** NOT STARTED

**Steps:**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add `VITE_API_URL` environment variable
4. Deploy and test

**Acceptance Criteria:**
- Frontend accessible via Vercel URL
- Environment variables configured
- Automatic deploys on push to main

---

#### Task 10: Deploy Backend to Railway/Render ⏳
**Time:** 45 minutes
**Status:** NOT STARTED

**Steps:**
1. Create Railway/Render account
2. Connect GitHub repo
3. Add environment variables
4. Deploy and test

**Acceptance Criteria:**
- Backend accessible via Railway/Render URL
- Health endpoint returns 200
- CORS allows frontend domain
- API key secured

---

#### Task 11: Production Environment Configuration ⏳
**Time:** 30 minutes
**Status:** NOT STARTED

**Requirements:**
- Update CORS for production domains
- Configure production API URL
- Ensure HTTPS for all connections
- Remove debug logging

**Acceptance Criteria:**
- CORS configured for production
- Frontend uses production API URL
- Debug logs disabled in production
- All connections use HTTPS

---

#### Task 12: Error Monitoring & Logging ⏳
**Time:** 45 minutes
**Status:** NOT STARTED

**Requirements:**
- Add error tracking (Sentry)
- Structured logging
- Performance monitoring

**Acceptance Criteria:**
- Errors captured and reported
- Can debug production issues
- Performance metrics visible

---

## Time Breakdown

| Category | Time |
|----------|------|
| Development Environment (1-2) | 50min ✅ |
| Backend Polish (3-5) | 1h 45min ✅ |
| Frontend Polish (6-8) | 1h 30min ⏳ |
| Deployment (9-11) | 1h 45min ⏳ |
| Monitoring (12) | 45min ⏳ |
| Testing & Bug Fixes | 1h ⏳ |
| **Total** | **~8-9 hours** |
| **Remaining** | **~5 hours** |

---

## Completion Checklist

### Milestone 3 Complete When:

**Development Environment:**
- [x] SSL/HTTPS working in local development
- [x] LAN network accessibility working
- [x] Friendly domain support
- [x] Windows Firewall configured

**Backend Polish:**
- [x] Response caching (10-min TTL)
- [x] Input validation complete
- [x] Rate limiting active (10 req/min)

**Frontend Polish:**
- [ ] Enhanced loading states
- [ ] LocalStorage for last search
- [ ] Mobile experience optimized

**Deployment:**
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Production environment configured
- [ ] Error monitoring active

**Testing:**
- [ ] End-to-end works in production
- [ ] Performance acceptable (<5s search)
- [ ] Error handling graceful
- [ ] Mobile tested on real device

---

## Post-Milestone 3 Enhancements

Future features to consider:
- User accounts and authentication
- Saved searches and favorites
- Activity sharing via link
- Map view with activity pins
- Price range filtering
- Weather-aware suggestions
- Email digest of weekly activities
- Review integration (Google/Yelp)
- Calendar export
- Mobile app (React Native)
