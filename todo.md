# Milestone 1 Tasks - Family Activity Finder

## Goal: Build UI with Dummy Data (4-6 hours)

---

## Setup Tasks

### ✅ Task 1: Create React Project with Vite
**Estimated Time:** 15 minutes

**Steps:**
1. Navigate to project directory
2. Run: `npm create vite@latest family-activity-finder -- --template react-ts`
3. cd into `family-activity-finder`
4. Install dependencies: `npm install`
5. Test that dev server runs: `npm run dev`

**Acceptance Criteria:**
- [x] Vite dev server runs on http://localhost:5173
- [x] Default React app displays in browser
- [x] No errors in console

---

### ✅ Task 2: Install and Configure TailwindCSS
**Estimated Time:** 15 minutes

**Steps:**
1. Install Tailwind: `npm install -D tailwindcss postcss autoprefixer`
2. Initialize config: `npx tailwindcss init -p`
3. Update `tailwind.config.js`:
   ```js
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           primary: '#3B82F6',
           success: '#10B981',
         }
       },
     },
     plugins: [],
   }
   ```
4. Update `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
5. Test Tailwind classes work in App.tsx

**Acceptance Criteria:**
- [x] Tailwind CSS classes apply correctly
- [x] Custom colors (primary, success) work
- [x] No build errors

---

### ✅ Task 3: Clean Up Boilerplate
**Estimated Time:** 10 minutes

**Steps:**
1. Delete: `src/App.css`, `src/assets/react.svg`
2. Clear out default content in `App.tsx`
3. Remove default styling from `index.css` (keep only Tailwind directives)
4. Update `index.html` title to "Family Activity Finder"
5. Optional: Add favicon

**Acceptance Criteria:**
- [x] Clean slate with no default boilerplate code
- [x] App.tsx is ready for new components
- [x] Browser tab shows "Family Activity Finder"

---

## Component Development

### ✅ Task 4: Create SearchForm Component
**Estimated Time:** 2 hours (includes 1.5 hours for geolocation feature)

**File:** `src/components/SearchForm.tsx`

**Requirements:**
- 5 input fields with clear labels
- **Auto-detect location** using browser geolocation on page load
- Responsive layout (mobile-first)
- Form validation (basic)
- Submit button

**Input Fields:**
1. **City** - Text input (required) **with auto-detection**
   - Auto-fills on page load using Navigator Geolocation API
   - Falls back to IP-based geolocation if GPS denied
   - Shows loading state while detecting
   - User can manually edit auto-filled value
   - Placeholder: "e.g., Seattle, WA" or "Detecting your location..."
2. **Kids Ages** - Text input (required)
   - Placeholder: "e.g., 5, 8 or 3-7"
3. **Availability** - Text input (required)
   - Placeholder: "e.g., Saturday afternoon"
4. **Max Distance** - Number input (required)
   - Placeholder: "Miles willing to drive"
5. **Preferences** - Textarea (optional)
   - Placeholder: "e.g., outdoor, educational, budget-friendly"

**Geolocation Implementation:**
- Use `useEffect` hook to run on component mount
- Try GPS geolocation first (`navigator.geolocation.getCurrentPosition`)
- Use BigDataCloud API to reverse geocode coordinates to city name
- If GPS fails/denied, fallback to IP-based geolocation
- Show loading state while detecting
- Display success/error messages
- Always allow manual override

**TypeScript Interface:**
```typescript
export interface SearchFormData {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
}
```

**Props:**
```typescript
interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void;
}
```

**Styling:**
- Use Tailwind form classes
- Primary blue button (#3B82F6)
- Proper spacing and padding
- Focus states on inputs

**Acceptance Criteria:**
- [x] All 5 inputs render correctly
- [x] City field auto-detects location on page load
- [x] Loading state shows while detecting location
- [x] GPS geolocation works when permission granted
- [x] IP geolocation fallback works when GPS denied
- [x] User can manually edit the auto-filled city
- [x] Success/error messages display appropriately
- [x] Form validates required fields
- [x] onSubmit callback fires with form data
- [x] Responsive on mobile and desktop
- [x] Accessible (labels, aria-labels)

---

### ✅ Task 5: Create ActivityCard Component
**Estimated Time:** 45 minutes

**File:** `src/components/ActivityCard.tsx`

**Requirements:**
- Display one activity recommendation
- Emoji + title + links + description
- Styled as a card with hover effect

**TypeScript Interface:**
```typescript
export interface Activity {
  id: number;
  name: string;
  emoji: string;
  website: string;
  mapsLink: string;
  description: string;
}
```

**Props:**
```typescript
interface ActivityCardProps {
  activity: Activity;
}
```

**Layout:**
```
+--------------------------------+
| 🎨 Seattle Children's Museum   |
| [Website] | [Directions]       |
|                                |
| Perfect for your 5 and 8...    |
| This hands-on museum...        |
+--------------------------------+
```

**Styling:**
- White background with subtle shadow
- Rounded corners
- Hover: slight elevation increase
- Emoji: Large size (text-4xl)
- Title: Bold, text-lg or xl
- Links: Primary blue, underline on hover
- Description: Gray text, 2-4 sentences

**Acceptance Criteria:**
- [x] Card displays all activity data
- [x] Links are clickable and styled
- [x] Hover effect works smoothly
- [x] Responsive (stacks on mobile)
- [x] Emoji displays correctly

---

### ✅ Task 6: Create ResultsGrid Component
**Estimated Time:** 30 minutes

**File:** `src/components/ResultsGrid.tsx`

**Requirements:**
- Grid layout for activity cards
- Responsive columns (1 mobile, 2-3 desktop)
- Display count of results

**Props:**
```typescript
interface ResultsGridProps {
  activities: Activity[];
}
```

**Layout:**
- 1 column on mobile (<768px)
- 2 columns on tablet (768px-1024px)
- 3 columns on desktop (>1024px)
- Gap between cards
- Header showing "Found 20 activities for you"

**Acceptance Criteria:**
- [x] Displays all 20 activities
- [x] Responsive grid layout
- [x] Proper spacing between cards
- [x] Shows result count

---

### ✅ Task 7: Create LoadingState Component
**Estimated Time:** 20 minutes

**File:** `src/components/LoadingState.tsx`

**Requirements:**
- Show while "searching" for activities
- Skeleton cards or spinner
- Friendly message

**Design Options:**
1. **Spinner with text:**
   - Animated spinner
   - "Finding perfect activities for your family..."

2. **Skeleton cards:**
   - 3-4 skeleton activity cards
   - Pulsing animation

**Recommendation:** Use spinner for simplicity in M1

**Acceptance Criteria:**
- [x] Loading animation displays
- [x] Centered on screen
- [x] Friendly message shows
- [x] Looks polished

---

## Dummy Data & Integration

### ✅ Task 8: Create Dummy Data
**Estimated Time:** 30 minutes

**File:** `src/data/dummyActivities.ts`

**Requirements:**
- 20 hardcoded activity objects
- Realistic data (Seattle-based examples)
- Variety of activity types

**Example Structure:**
```typescript
export const dummyActivities: Activity[] = [
  {
    id: 1,
    name: "Woodland Park Zoo",
    emoji: "🦁",
    website: "https://www.zoo.org",
    mapsLink: "https://www.google.com/maps/dir/?api=1&origin=Seattle,WA&destination=5500+Phinney+Ave+N+Seattle+WA+98103",
    description: "Perfect for your 5 and 8 year olds with over 1,000 animals across 92 acres. The zoo offers age-appropriate exhibits and interactive areas. Plan for 3-4 hours to explore."
  },
  // ... 19 more activities
];
```

**Activity Types to Include:**
- Zoos/aquariums (🦁, 🐠)
- Museums (🎨, 🔬)
- Parks/playgrounds (🌳, 🎠)
- Indoor play centers (🎪, 🧩)
- Libraries/bookstores (📚)
- Sports/recreation (⚽, 🏊)
- Entertainment (🎬, 🎭)
- Food experiences (🍕, 🍦)

**Acceptance Criteria:**
- [x] 20 diverse activities
- [x] All fields populated
- [x] Realistic descriptions (2-4 sentences)
- [x] Valid Google Maps links

---

### ✅ Task 9: Implement Google Maps Link Generator
**Estimated Time:** 20 minutes

**File:** `src/utils/mapLinks.ts`

**Function:**
```typescript
export function generateMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}`;
}
```

**Requirements:**
- Properly encode parameters
- Handle edge cases (empty strings)
- Test with real addresses

**Acceptance Criteria:**
- [x] Function generates valid Google Maps URLs
- [x] Links open in new tab and show directions
- [x] Encoding handles special characters

---

### ✅ Task 10: Wire Up App.tsx
**Estimated Time:** 30 minutes

**File:** `src/App.tsx`

**Requirements:**
- Import all components
- Manage state (form data, activities, loading)
- Handle form submission
- Conditional rendering

**State Management:**
```typescript
const [activities, setActivities] = useState<Activity[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [hasSearched, setHasSearched] = useState(false);
```

**Flow:**
1. Show SearchForm
2. On submit → Show LoadingState (1-2 seconds)
3. After delay → Show ResultsGrid with dummy data

**Acceptance Criteria:**
- [x] Form submission triggers loading state
- [x] After 1-2 seconds, shows 20 dummy activities
- [x] Can search again (results update)
- [x] No errors in console

---

## Styling & Polish

### ✅ Task 11: Add Responsive Layout
**Estimated Time:** 20 minutes

**Requirements:**
- Mobile-first design
- Proper padding/margins
- Max width for content (container)

**Layout:**
- Container: max-w-7xl, centered
- Padding: px-4 on mobile, px-8 on desktop
- SearchForm: max-w-2xl, centered

**Acceptance Criteria:**
- [x] Looks good on mobile (375px)
- [x] Looks good on tablet (768px)
- [x] Looks good on desktop (1440px)
- [x] No horizontal scroll
- [x] Proper spacing everywhere

---

### ✅ Task 12: Add Header & Branding
**Estimated Time:** 15 minutes

**Requirements:**
- App title/logo
- Tagline or description
- Simple header design

**Content:**
- Title: "Family Activity Finder"
- Tagline: "Discover perfect activities for your family"
- Optional: Simple icon/emoji

**Styling:**
- Centered, top of page
- Large title (text-3xl or 4xl)
- Subtle tagline (text-gray-600)

**Acceptance Criteria:**
- [x] Header displays at top
- [x] Branded and professional
- [x] Responsive text sizes

---

### ✅ Task 13: Test & Fix Bugs
**Estimated Time:** 30 minutes

**Testing Checklist:**
- [x] Form validation works
- [x] Required fields show errors
- [x] Submit button disabled when invalid
- [x] Loading state shows/hides correctly
- [x] All 20 activities display
- [x] Cards look good (no layout breaks)
- [x] Links work (open in new tab)
- [x] Mobile responsive
- [x] Desktop responsive
- [x] No console errors
- [x] No TypeScript errors

**Common Issues to Check:**
- Missing keys on mapped components
- Typescript type mismatches
- Broken links
- Styling inconsistencies
- Form reset after submission

---

## Final Deliverables Checklist

### ✅ Milestone 1 Complete When:

**Functionality:**
- [x] Form accepts all 5 inputs (city, ages, availability, distance, preferences)
- [x] Submit triggers loading state for 1-2 seconds
- [x] 20 dummy activities display in grid
- [x] Each card shows: emoji, title, website link, directions link, description
- [x] Google Maps direction links work correctly
- [x] Can perform multiple searches

**UI/UX:**
- [x] Clean, professional design
- [x] Responsive on mobile, tablet, desktop
- [x] Loading state provides feedback
- [x] Form has clear labels and placeholders
- [x] Cards have hover effects
- [x] Colors match design guidelines (blue/green/gray)

**Code Quality:**
- [x] TypeScript types defined for all data
- [x] Components properly organized in `/components`
- [x] No console errors or warnings
- [x] Clean, readable code
- [x] Proper use of Tailwind classes

**Documentation:**
- [x] README.md with setup instructions
- [x] Comments on complex logic
- [x] Component props documented

---

## Next Steps (Milestone 2 Preview)

After completing M1, you'll have:
- ✅ Working UI with form and results display
- ✅ Dummy data showing expected output format
- ✅ Responsive, styled application

For Milestone 2, you'll:
1. Set up Express backend
2. Integrate Claude API with web search
3. Replace dummy data with real activity searches
4. Use the prompt from `prompt.md`

---

## Time Breakdown

| Task | Estimated Time |
|------|----------------|
| Setup (Tasks 1-3) | 40 min |
| SearchForm | 45 min |
| ActivityCard | 45 min |
| ResultsGrid | 30 min |
| LoadingState | 20 min |
| Dummy Data | 30 min |
| Maps Link Generator | 20 min |
| Wire Up App | 30 min |
| Responsive Layout | 20 min |
| Header/Branding | 15 min |
| Testing & Bug Fixes | 30 min |
| **TOTAL** | **~5 hours** |

**Buffer:** Add 1-2 hours for learning/debugging = **6-7 hours total**

---

## Tips for Success

1. **Start with setup** - Get the project running first
2. **Build components incrementally** - Test each one before moving on
3. **Use Tailwind docs** - Reference for form styling and grid layouts
4. **Test frequently** - Check in browser after each component
5. **Mobile first** - Design for mobile, then scale up
6. **Keep it simple** - Don't over-engineer, M1 is about UI only
7. **Commit often** - Git commit after each completed task

---

## Resources

- [Vite Docs](https://vitejs.dev/guide/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)

---

## Need Help?

If you get stuck:
1. Check browser console for errors
2. Check terminal for TypeScript errors
3. Review component props and types
4. Test components in isolation
5. Refer to `spec.md` for requirements

Good luck! 🚀

---
---

# Milestone 2 Tasks - Family Activity Finder

## Goal: Backend Integration with Claude API (8-10 hours)

---

## Backend Setup Tasks

### Task 1: Initialize Backend Project
**Estimated Time:** 30 minutes

**Steps:**
1. Create `backend/` directory at project root
2. Navigate to backend: `cd backend`
3. Initialize Node.js: `npm init -y`
4. Install dependencies:
   ```bash
   npm install express @anthropic-ai/sdk cors dotenv
   npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
   ```
5. Initialize TypeScript: `npx tsc --init`
6. Update tsconfig.json with:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```
7. Create folder structure:
   ```
   backend/
   ├── src/
   │   ├── server.ts
   │   ├── routes/
   │   ├── services/
   │   └── types/
   ├── .env
   ├── .gitignore
   ├── package.json
   └── tsconfig.json
   ```
8. Add scripts to package.json:
   ```json
   "scripts": {
     "dev": "nodemon --exec ts-node src/server.ts",
     "build": "tsc",
     "start": "node dist/server.js"
   }
   ```

**Acceptance Criteria:**
- [ ] Backend folder structure created
- [ ] All dependencies installed (check package.json)
- [ ] TypeScript configured correctly
- [ ] Dev script runs without errors
- [ ] .gitignore includes node_modules and .env

---

### Task 2: Create Express Server
**Estimated Time:** 45 minutes

**File:** `backend/src/server.ts`

**Requirements:**
- Express server with CORS enabled
- Health check endpoint
- Environment variable configuration
- Error handling middleware
- Request logging

**Implementation:**
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRouter from './routes/search';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', searchRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
```

**Acceptance Criteria:**
- [ ] Server starts on port 3001
- [ ] Health check endpoint returns JSON with status
- [ ] CORS properly configured
- [ ] Request logging works
- [ ] Error handling middleware catches errors
- [ ] No TypeScript compilation errors

---

### Task 3: Set Up Anthropic API Configuration
**Estimated Time:** 20 minutes

**Files:** `backend/.env`, `backend/.env.example`, `backend/.gitignore`

**Requirements:**
- Anthropic API key stored securely
- Environment configuration
- Template for other developers

**Steps:**
1. Create `backend/.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5174
   ```

2. Create `backend/.env.example`:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5174
   ```

3. Update `backend/.gitignore`:
   ```
   node_modules/
   dist/
   .env
   .env.local
   *.log
   ```

4. Get API key from https://console.anthropic.com/

**Acceptance Criteria:**
- [ ] .env file created with actual API key
- [ ] .env.example created without sensitive data
- [ ] .env excluded from git (in .gitignore)
- [ ] Can access process.env.ANTHROPIC_API_KEY in code
- [ ] API key is valid (test with health check)

---

## Claude API Integration Tasks

### Task 4: Create Claude Service
**Estimated Time:** 2 hours

**File:** `backend/src/services/claudeService.ts`

**Requirements:**
- Initialize Anthropic SDK
- Build prompt from prompt.md template
- Enable web_search_20250305 tool
- Parse JSON from Claude's response
- Comprehensive error handling

**Implementation:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SearchParams {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
}

export interface ClaudeActivity {
  name: string;
  emoji: string;
  website: string;
  address: string;
  description: string;
}

export async function searchActivities(params: SearchParams): Promise<ClaudeActivity[]> {
  const { city, kidsAges, availability, maxDistance, preferences } = params;

  // Build prompt from prompt.md template
  const userPrompt = `
I'm looking for family activities in ${city}.

Details:
- Kids ages: ${kidsAges}
- Availability: ${availability}
- Maximum distance: ${maxDistance} miles
- Preferences: ${preferences || 'None specified'}

Please search the web for the top 20 family-friendly activities that match these criteria and return them in JSON format.
  `.trim();

  const systemPrompt = `You are a helpful family activity recommendation assistant. Your task is to search the web for real, current family activities based on the user's location and preferences.

IMPORTANT: You MUST return your response as a valid JSON array with exactly this structure:
[
  {
    "name": "Activity Name",
    "emoji": "🎨",
    "website": "https://...",
    "address": "Full street address with city and state",
    "description": "3-5 sentence description including age appropriateness, what to expect, how long to plan, and why it's great for families."
  }
]

Requirements:
- Return exactly 20 activities
- Use web search to find REAL, CURRENT activities
- Verify websites are active and correct
- Include full addresses (street, city, state, zip)
- Descriptions must be 3-5 sentences
- Choose relevant emoji for each activity
- Prioritize activities that are age-appropriate and family-friendly
- Consider the user's availability and preferences
- Focus on activities within the specified distance

Return ONLY the JSON array, no other text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      tools: [
        {
          type: 'web_search_20250305' as any,
          name: 'web_search',
          max_uses: 15,
        },
      ],
    });

    // Extract text content from response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const activities: ClaudeActivity[] = JSON.parse(jsonMatch[0]);

    // Validate response
    if (!Array.isArray(activities) || activities.length === 0) {
      throw new Error('Invalid activities array');
    }

    // Validate each activity has required fields
    activities.forEach((activity, index) => {
      if (!activity.name || !activity.emoji || !activity.website || !activity.address || !activity.description) {
        throw new Error(`Activity at index ${index} is missing required fields`);
      }
    });

    return activities;
  } catch (error) {
    console.error('Claude API Error:', error);
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
    throw error;
  }
}
```

**Acceptance Criteria:**
- [ ] Anthropic SDK properly initialized
- [ ] Prompt template uses all 5 input parameters
- [ ] Web search tool enabled with max_uses: 15
- [ ] System prompt enforces 3-5 sentence descriptions
- [ ] JSON parsing handles Claude's response format
- [ ] Validates all required fields present
- [ ] Error handling for API failures
- [ ] Error handling for invalid JSON
- [ ] Error handling for missing fields
- [ ] Logs errors for debugging

---

### Task 5: Create Activity Formatter Service
**Estimated Time:** 30 minutes

**File:** `backend/src/services/activityFormatter.ts`

**Requirements:**
- Add Google Maps links
- Add Apple Maps links
- Add unique IDs
- URL encoding for addresses

**Implementation:**
```typescript
import type { ClaudeActivity } from './claudeService';

export interface FormattedActivity {
  id: number;
  name: string;
  emoji: string;
  website: string;
  address: string;
  googleMapsLink: string;
  appleMapsLink: string;
  description: string;
}

function generateGoogleMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}`;
}

function generateAppleMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://maps.apple.com/?daddr=${encodedDest}&saddr=${encodedOrigin}`;
}

export function formatActivities(
  activities: ClaudeActivity[],
  userCity: string
): FormattedActivity[] {
  return activities.map((activity, index) => ({
    id: index + 1,
    name: activity.name,
    emoji: activity.emoji,
    website: activity.website,
    address: activity.address,
    googleMapsLink: generateGoogleMapsLink(userCity, activity.address),
    appleMapsLink: generateAppleMapsLink(userCity, activity.address),
    description: activity.description,
  }));
}
```

**Acceptance Criteria:**
- [ ] IDs assigned sequentially (1-20)
- [ ] Google Maps links generated correctly
- [ ] Apple Maps links generated correctly
- [ ] URL encoding handles special characters
- [ ] All fields from Claude response preserved
- [ ] Returns proper TypeScript types

---

### Task 6: Create Search API Route
**Estimated Time:** 45 minutes

**File:** `backend/src/routes/search.ts`

**Requirements:**
- POST /api/search endpoint
- Request validation
- Call Claude service
- Format response with map links
- Comprehensive error handling

**Implementation:**
```typescript
import express, { Request, Response } from 'express';
import { searchActivities, type SearchParams } from '../services/claudeService';
import { formatActivities } from '../services/activityFormatter';

const router = express.Router();

router.post('/search', async (req: Request, res: Response) => {
  try {
    const { city, kidsAges, availability, maxDistance, preferences } = req.body;

    // Validate required fields
    if (!city || !kidsAges || !availability || !maxDistance) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['city', 'kidsAges', 'availability', 'maxDistance'],
      });
    }

    // Validate data types
    if (typeof city !== 'string' || typeof kidsAges !== 'string' ||
        typeof availability !== 'string' || typeof maxDistance !== 'string') {
      return res.status(400).json({
        error: 'Invalid field types',
      });
    }

    console.log(`🔍 Searching activities for: ${city}, Kids: ${kidsAges}`);

    // Call Claude service
    const searchParams: SearchParams = {
      city,
      kidsAges,
      availability,
      maxDistance,
      preferences: preferences || '',
    };

    const activities = await searchActivities(searchParams);
    console.log(`✅ Found ${activities.length} activities`);

    // Add map links and IDs
    const formattedActivities = formatActivities(activities, city);

    res.json({
      success: true,
      count: formattedActivities.length,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error('❌ Search error:', error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Anthropic API')) {
        return res.status(502).json({
          error: 'Failed to connect to AI service',
          message: 'Please try again in a moment',
        });
      }

      if (error.message.includes('JSON')) {
        return res.status(500).json({
          error: 'Failed to process activity data',
          message: 'Please try again',
        });
      }

      return res.status(500).json({
        error: 'Failed to search activities',
        message: error.message,
      });
    }

    res.status(500).json({
      error: 'An unexpected error occurred',
    });
  }
});

export default router;
```

**Acceptance Criteria:**
- [ ] POST /api/search endpoint works
- [ ] Validates all required fields
- [ ] Validates field types
- [ ] Returns 400 for missing/invalid fields
- [ ] Calls Claude service successfully
- [ ] Formats activities with map links
- [ ] Returns JSON with activities array
- [ ] Error responses are informative
- [ ] Handles API timeouts gracefully
- [ ] Logs requests for debugging

---

## Frontend Integration Tasks

### Task 7: Create API Service in Frontend
**Estimated Time:** 30 minutes

**File:** `family-activity-finder/src/services/api.ts`

**Requirements:**
- Fetch function to call backend
- Type safety with TypeScript
- Error handling
- Environment-aware API URL

**Implementation:**
```typescript
import type { SearchFormData, Activity } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function searchActivities(
  formData: SearchFormData
): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'Failed to fetch activities',
        response.status,
        data
      );
    }

    return data.activities;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network error
    if (error instanceof TypeError) {
      throw new APIError('Unable to connect to server. Please check your connection.');
    }

    throw new APIError('An unexpected error occurred');
  }
}
```

**Environment Variable:**
Create `family-activity-finder/.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
```

**Acceptance Criteria:**
- [ ] API service makes POST requests
- [ ] TypeScript types are correct
- [ ] Handles network errors
- [ ] Handles API errors (400, 500)
- [ ] Uses environment variable for URL
- [ ] Custom APIError class works
- [ ] Returns typed Activity[] array

---

### Task 8: Update App.tsx to Use Real API
**Estimated Time:** 30 minutes

**File:** `family-activity-finder/src/App.tsx`

**Requirements:**
- Replace dummy data with API call
- Add error state
- Handle loading state
- Display errors to user

**Changes:**
```typescript
import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsGrid from './components/ResultsGrid';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import type { Activity, SearchFormData } from './types/index.ts';
import { searchActivities } from './services/api';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formData: SearchFormData) => {
    console.log('Search parameters:', formData);

    setIsLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const results = await searchActivities(formData);
      setActivities(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to find activities. Please try again.'
      );
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full Width */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            Family Activity Finder
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Discover perfect activities for your family
          </p>
        </div>
      </header>

      {/* Split-Pane Layout */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Left Pane - Search Form */}
        <aside className="w-full md:w-2/5 lg:w-1/3 px-4 py-6 sm:px-6">
          <div className="md:sticky md:top-6">
            <SearchForm onSubmit={handleSearch} />
          </div>
        </aside>

        {/* Right Pane - Results */}
        <main className="flex-1 px-4 py-6 sm:px-6">
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} onRetry={handleRetry} />}
          {!isLoading && !error && hasSearched && <ResultsGrid activities={activities} />}
          {!hasSearched && !error && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">
                Enter your search criteria to find family activities
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
```

**Acceptance Criteria:**
- [ ] Removed import of dummyActivities
- [ ] Uses searchActivities from api.ts
- [ ] Error state displays when API fails
- [ ] Loading state shows during API call
- [ ] Activities display after successful search
- [ ] Can retry after error
- [ ] No TypeScript errors
- [ ] Console logs show API calls

---

### Task 9: Add Error Display Component
**Estimated Time:** 20 minutes

**File:** `family-activity-finder/src/components/ErrorState.tsx`

**Requirements:**
- Display error message
- Retry button
- Consistent styling

**Implementation:**
```typescript
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Error icon displays
- [ ] Message is user-friendly
- [ ] Retry button works (if provided)
- [ ] Consistent styling with app
- [ ] Responsive layout

---

## Development Experience

### Task 10: Set Up Concurrent Development
**Estimated Time:** 15 minutes

**Files:** `family-activity-finder/package.json`, `package.json` (root)

**Requirements:**
- Run frontend and backend with one command
- Both servers hot-reload
- Clear console output

**Steps:**

1. Install concurrently at project root:
   ```bash
   cd C:\Users\krish\Apps
   npm init -y  # if no package.json exists
   npm install -D concurrently
   ```

2. Add scripts to root `package.json`:
   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
       "dev:frontend": "cd family-activity-finder && npm run dev",
       "dev:backend": "cd backend && npm run dev"
     }
   }
   ```

**Acceptance Criteria:**
- [ ] `npm run dev` starts both servers
- [ ] Frontend runs on port 5174
- [ ] Backend runs on port 3001
- [ ] Both show colored output
- [ ] Hot reload works for both
- [ ] Can stop both with Ctrl+C

---

## Testing & Polish

### Task 11: End-to-End Testing
**Estimated Time:** 1 hour

**Testing Checklist:**

**Backend Tests:**
- [ ] Backend starts without errors
- [ ] Health check endpoint returns 200
- [ ] Can call /api/search with valid data
- [ ] Returns 400 for missing fields
- [ ] Returns proper error for invalid API key
- [ ] Claude API returns 20 activities
- [ ] Activities have all required fields
- [ ] Map links are generated correctly

**Frontend Tests:**
- [ ] Form submits to backend
- [ ] Loading state shows during API call
- [ ] Activities display after search
- [ ] All 20 activities render
- [ ] Activity cards show descriptions (3-5 sentences each)
- [ ] Google Maps links work
- [ ] Apple Maps links work
- [ ] Website links work (open in new tab)
- [ ] Error displays when backend is offline
- [ ] Retry button works after error
- [ ] Can perform multiple searches
- [ ] No console errors
- [ ] No TypeScript errors

**Responsive Tests:**
- [ ] Mobile layout works (form stacks on top)
- [ ] Desktop layout works (split-pane)
- [ ] Sticky form works on desktop
- [ ] No horizontal scroll

**Edge Cases:**
- [ ] Empty preferences field works
- [ ] Large distance numbers work
- [ ] Special characters in city names work
- [ ] Multiple kid ages work (e.g., "5, 8, 12")

---

### Task 12: Add Response Caching (Optional)
**Estimated Time:** 45 minutes

**File:** `backend/src/services/cacheService.ts`

**Requirements:**
- Cache identical searches
- 10-minute TTL
- Reduce API costs
- Memory-efficient

**Implementation:**
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number; // milliseconds

  constructor(ttlMinutes: number = 10) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const activityCache = new CacheService(10);
```

**Update search route:**
```typescript
// In search.ts
const cacheKey = JSON.stringify(searchParams);
const cached = activityCache.get(cacheKey);

if (cached) {
  console.log('✨ Returning cached results');
  return res.json({
    success: true,
    cached: true,
    count: cached.length,
    activities: cached,
  });
}

// ... call Claude API ...

activityCache.set(cacheKey, formattedActivities);
```

**Acceptance Criteria:**
- [ ] Identical searches use cached data
- [ ] Cache expires after 10 minutes
- [ ] Cache key includes all search params
- [ ] Cached response includes "cached: true"
- [ ] Cache doesn't break error handling
- [ ] Can clear cache if needed

---

### Task 13: Documentation & README Updates
**Estimated Time:** 30 minutes

**Files:** `README.md`, `backend/README.md`

**Requirements:**
- Complete setup instructions
- Environment variable documentation
- API endpoint documentation
- Architecture diagram

**Update Project README.md:**
```markdown
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
- Anthropic Claude API (Sonnet 3.5)
- Web Search Tool

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd <repo-name>

# Install root dependencies (for running both servers)
npm install

# Install frontend dependencies
cd family-activity-finder
npm install

# Install backend dependencies
cd ../backend
npm install
\`\`\`

### 2. Configure Environment Variables

**Backend (.env):**
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env and add your Anthropic API key
\`\`\`

**Frontend (.env.local):**
\`\`\`bash
cd family-activity-finder
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
\`\`\`

### 3. Run the Application

From the project root:
\`\`\`bash
npm run dev
\`\`\`

This starts both:
- Frontend: http://localhost:5174
- Backend: http://localhost:3001

Or run them separately:
\`\`\`bash
# Terminal 1 - Frontend
cd family-activity-finder
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
\`\`\`

## API Documentation

### POST /api/search

Search for family activities.

**Request:**
\`\`\`json
{
  "city": "Seattle, WA",
  "kidsAges": "5, 8",
  "availability": "Saturday afternoon",
  "maxDistance": "25",
  "preferences": "outdoor, educational"
}
\`\`\`

**Response:**
\`\`\`json
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
\`\`\`

## Project Structure

\`\`\`
.
├── family-activity-finder/  # Frontend React app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── data/            # Dummy data (M1 only)
│   └── package.json
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Claude API, caching
│   │   └── types/           # TypeScript types
│   └── package.json
└── package.json             # Root (runs both servers)
\`\`\`

## Development

- Frontend hot reload: Vite HMR
- Backend hot reload: Nodemon + ts-node
- TypeScript: Strict mode enabled
- Linting: ESLint configured

## License

MIT
```

**Acceptance Criteria:**
- [ ] README has complete setup instructions
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Project structure explained
- [ ] Prerequisites listed
- [ ] Both development modes documented

---

## Final Deliverables Checklist

### Milestone 2 Complete When:

**Backend:**
- [ ] Express server runs on port 3001
- [ ] Claude API integration works
- [ ] Web search tool enabled
- [ ] Returns 20 real activities
- [ ] All activities have 3-5 sentence descriptions
- [ ] Map links generated correctly
- [ ] Error handling works
- [ ] Environment variables configured

**Frontend:**
- [ ] Calls backend API instead of dummy data
- [ ] Displays real search results
- [ ] Shows 3-5 sentence descriptions for each activity
- [ ] Loading state during API calls
- [ ] Error handling with retry
- [ ] All links work (website, maps)
- [ ] Mobile and desktop responsive

**Integration:**
- [ ] End-to-end flow works
- [ ] Can run both servers with one command
- [ ] No CORS errors
- [ ] No TypeScript errors
- [ ] No console errors

**Documentation:**
- [ ] README updated with setup instructions
- [ ] API documented
- [ ] Environment variables explained
- [ ] Code comments for complex logic

---

## Time Breakdown - Milestone 2

| Category | Time |
|----------|------|
| Backend Setup | 1h 35min |
| Claude Integration | 3h 15min |
| Frontend Updates | 1h 20min |
| Dev Experience | 15min |
| Testing | 1h |
| Caching (Optional) | 45min |
| Documentation | 30min |
| **Total** | **8h 40min** |

**Recommended:** Allow 10 hours for learning and debugging

---

## Next Steps (Milestone 3 Preview)

After completing M2, you'll have:
- ✅ Fully functional app with real AI-powered recommendations
- ✅ Production-ready backend API
- ✅ Beautiful, responsive UI

For Milestone 3 (optional enhancements):
1. Deploy to production (Vercel + Railway/Render)
2. Add user accounts and saved searches
3. Activity favoriting and sharing
4. Enhanced filtering (price range, category)
5. Map view with pins for all activities
6. Review integration (Google Reviews API)

---

Good luck with Milestone 2! 🚀
