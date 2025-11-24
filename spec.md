# Family Activity Finder - Specification

## Project Overview

A web application that helps parents discover family-friendly activities based on their location, children's ages, availability, and preferences. The app uses AI-powered search to find and rank the best 20 activities with personalized recommendations.

## Requirements

### User Inputs
1. **City/Location** - Where the family is located
   - **Auto-detected** using browser geolocation on page load
   - Falls back to IP-based geolocation if GPS permission denied
   - User can manually edit the auto-filled value
2. **Kids Ages** - Text input of Age(s) of children (e.g., "5, 8" or "3-7")
3. **Availability** - When they're free (e.g., "Saturday afternoon", "weekday evenings")
4. **Max Distance** - How far they're willing to drive (in miles)
5. **Preferences** (Optional) - Text input of Any additional preferences (e.g., "outdoor", "educational", "budget-friendly")

### Output Format

Return **top 20 activity recommendations**, each with:
- **Bold title** - Name of the activity/event (specific, not just venue)
- **Emoji** - Contextually appropriate emoji
- **Activity link** - Direct link to the venue/activity website
- **Google Maps link** - Directions from user's current location
- **Apple Maps link** - Directions for iOS users
- **Description** - 2-4 sentences explaining why it's a good fit
- **Event Date** - When the event runs (e.g., "Nov 15 - Jan 5, 2025") or "Ongoing"
- **Event Type** - One of: seasonal, exhibition, show, class, permanent

### Example Output

**🏮 WildLanterns at Woodland Park Zoo**
[Website](https://www.zoo.org/wildlanterns) | [Google Maps](https://maps.google.com/...) | [Apple Maps](https://maps.apple.com/...)
📅 Nov 15, 2024 - Jan 19, 2025 | Seasonal & Holiday

A magical lantern festival featuring illuminated animal sculptures. Perfect for your 6-year-old with interactive light displays. Runs evenings only, allow 1.5-2 hours to explore all the exhibits.

---

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool with HMR
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing (if needed)

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Anthropic SDK** - For Claude Messages API
- **Dotenv** - Environment variable management

### APIs & Tools
- **Claude Messages API (Sonnet 4.5)**
  - With `web_search_20250305` tool enabled
  - **Streaming API** for long-running web searches
  - **Prompt caching** for 90% cost reduction
  - **Exponential backoff** for rate limit handling
  - Pricing: $10 per 1,000 searches + token costs
- **BigDataCloud Reverse Geocoding API**
  - Free client-side API for converting GPS coordinates to city names
  - Also provides IP-based geolocation fallback
  - No API key required
- **Google Maps API** (for directions links)
- **Apple Maps API** (for iOS directions links)

### API Features
- **Time-sensitive event discovery** - Prompts include current date/season
- **Event type filtering** - Filter by seasonal, exhibition, show, class, permanent
- **Event dates in response** - Each activity includes event date range

### Development Tools
- **Nodemon** - Auto-restart during development
- **Concurrently** - Run frontend + backend simultaneously
- **ESLint** - Code linting
- **mkcert** - Generate trusted local SSL certificates for HTTPS development

---

## Design Guidelines

### Keep It Simple
- **Single-page form** - All inputs on one screen
- **Card-based results** - Each activity in a clean, scannable card
- **Mobile-first** - Responsive design for parents on-the-go
- **Fast loading** - Show loading state while AI searches

### UI Components
1. **Search Form**
   - Clean input fields with clear labels
   - Submit button that triggers search
   - Optional: Save preferences in localStorage

2. **Results Display**
   - Grid of activity cards (1 column mobile, 2-3 desktop)
   - Each card: emoji + title + links + description
   - Smooth loading skeleton while fetching

3. **Error States**
   - Friendly messages for API errors
   - Retry button if search fails
   - Validation messages for form inputs

### Color Palette (Suggestion)
- Primary: Friendly blue (#3B82F6)
- Success: Green (#10B981)
- Background: Light gray (#F9FAFB)
- Text: Dark gray (#111827)

---

## Milestones

### Milestone 1: UI with Dummy Data
**Goal:** Build a functional frontend with hardcoded activities

**Tasks:**
1. Set up React + Vite + TypeScript + Tailwind project
2. Create form component with all 5 input fields
3. **Implement browser geolocation auto-fill**
   - Auto-detect location on page load using Navigator Geolocation API
   - Use BigDataCloud API for reverse geocoding (GPS → city name)
   - Fallback to IP-based geolocation if GPS permission denied
   - Allow manual override of auto-filled location
4. Create activity card component
5. Display 20 dummy activities when form is submitted
6. Add Google Maps directions link generator (formula-based)
7. Make it responsive and styled

**Deliverable:** Working UI that looks good, auto-detects location, and displays mock data

**Time Estimate:** 6-8 hours (includes 1.5-2 hours for geolocation feature)

---

### Milestone 2: Claude API Integration
**Goal:** Replace dummy data with real AI-powered activity search

**Tasks:**
1. Set up Express backend with TypeScript
2. Install Anthropic SDK and configure API key
3. Create `/api/search` endpoint that:
   - Receives user inputs from frontend
   - Constructs prompt for Claude (see `prompt.md` for complete prompt template)
   - Enables `web_search_20250305` tool
   - Parses Claude's response into structured data
4. Update frontend to call backend API
5. Handle loading and error states

**Implementation Guide:**
- **Full prompt template:** See `prompt.md` for the complete, production-ready prompt
- **Backend code examples:** `prompt.md` includes TypeScript implementation snippets
- **Response processing:** `prompt.md` shows how to parse JSON and add Google Maps links

**Claude Implementation Quick Reference:**
```javascript
// Enable web search tool
const tools = [{
  type: "web_search_20250305",
  name: "web_search",
  max_uses: 15,
  user_location: {
    city: userCity,
    country: "USA"
  }
}];

// Use the full prompt from prompt.md
// It requests JSON output with: name, emoji, website, address, description
```

**Deliverable:** Fully functional app with real-time AI search

**Time Estimate:** 6-8 hours

---

### Milestone 3: Polish & Deploy
**Goal:** Production-ready application

**Tasks:**

1. **Development Environment (Tasks 1-2)**
   - SSL/HTTPS for local development using mkcert
   - LAN network accessibility (access from mobile devices on same WiFi)

2. **Backend Polish (Tasks 3-5)**
   - Response caching for identical searches (10 min TTL)
   - Input validation and sanitization
   - Rate limiting (10 requests/min per IP)

3. **Frontend Polish (Tasks 6-8)**
   - Enhanced loading states with skeleton cards
   - Save last search in localStorage
   - Improved mobile experience (touch-friendly, collapsible form)

4. **Deployment (Tasks 9-12)**
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Production environment configuration (CORS, HTTPS)
   - Error monitoring and logging (Sentry or similar)

**Deliverable:** Live, deployed application with polished UX

**Time Estimate:** 7-9 hours

---

## API Cost Estimates

### Claude API (web search enabled)
- **Base cost:** $10 per 1,000 searches
- **Token costs:** ~$3-5 per 1,000 input tokens, ~$15 per 1,000 output tokens (Sonnet 4.5)
- **Estimated per search:** $0.02-0.05 (includes search + reasoning + response)

### Google Maps API (optional)
- **Directions API:** $5 per 1,000 requests
- **Can use free link formula:** `https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}`

### Monthly estimates (500 searches/month)
- Claude: ~$10-25
- Maps: Free (using link formula) or ~$2.50 (if using API)

---

## Project Structure

```
family-activity-finder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchForm.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ResultsGrid.tsx
│   │   │   └── LoadingState.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── search.ts
│   │   ├── services/
│   │   │   ├── claudeService.ts
│   │   │   └── activityFormatter.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── spec.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Anthropic API key (from console.anthropic.com)
- Web search tool enabled in your Anthropic organization

### Environment Variables
```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
NODE_ENV=development
```

---

## Success Criteria

**Milestone 1 Complete When:**
- [ ] Form accepts all 5 inputs
- [ ] 20 dummy activities display on submit
- [ ] UI is responsive and styled
- [ ] Google Maps links work

**Milestone 2 Complete When:**
- [ ] Backend calls Claude API successfully
- [ ] Web search tool finds real activities
- [ ] Results display with actual venue data
- [ ] Links work (venue website + directions)

**Milestone 3 Complete When:**
- [ ] SSL/HTTPS working in local development
- [ ] LAN network accessibility working
- [ ] Response caching and rate limiting active
- [ ] App is deployed and publicly accessible
- [ ] Error handling works smoothly
- [ ] Performance is acceptable (<5 second search)
- [ ] App is ready for real users

---

## Future Enhancements (Post-MVP)

- User accounts & saved favorites
- Activity history tracking
- Review integration (pull from Yelp/Google)
- Weather-aware suggestions
- Budget filtering
- Accessibility preferences
- Email digest of weekly activities
