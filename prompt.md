# Claude API Prompt - Family Activity Finder

## System Prompt

```
You are a family activity expert who helps parents discover perfect activities for their children. Your recommendations are personalized, practical, and based on current, real information from web searches.
```

---

## Main Prompt Template

```
I need you to find the top 20 family activities based on these specific criteria:

**Location:** {CITY}
**Children's Ages:** {KIDS_AGES}
**When Available:** {AVAILABILITY}
**Maximum Distance:** {MAX_DISTANCE} miles from their location
**Additional Preferences:** {PREFERENCES}

Please search the web to find current, real, timely events and activities that fit these criteria. Consider:
- Age-appropriateness for children aged {KIDS_AGES}
- Operating hours that match "{AVAILABILITY}"
- Venues within {MAX_DISTANCE} miles of {CITY}
- The specific preferences: {PREFERENCES}

For each activity, I need:
1. **Activity Name** - The official name of the venue/activity
2. **Website URL** - Direct link to the venue's website or booking page
3. **Description** - 2-4 sentences explaining:
   - Why it's perfect for this family
   - What makes it age-appropriate
   - How long it typically takes
   - Any special features or highlights
4. **Emoji** - One contextually appropriate emoji that represents the activity
5. **Address** - Full street address for Google Maps

Return EXACTLY 20 activities, ranked from best to worst fit. Prioritize:
- High ratings and recent positive reviews
- Activities that match the availability time slot
- Venues with good facilities for the specified age group
- Variety (mix of indoor/outdoor, active/educational, etc.)

**IMPORTANT:** Return your response as a valid JSON array with this exact structure:

```json
[
  {
    "name": "Activity Name Here",
    "emoji": "🎨",
    "website": "https://example.com",
    "address": "123 Main St, City, State ZIP",
    "description": "Why this is perfect for this family. What makes it age-appropriate. Typical duration. Special highlights."
  }
]
```

Do not include any text before or after the JSON array. Only return the JSON.
```

---

## Input Variables Reference

Replace these placeholders when calling the API:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `{CITY}` | `Seattle, WA` | City and state |
| `{KIDS_AGES}` | `5, 8` or `3-7` | Ages or age range |
| `{AVAILABILITY}` | `Saturday afternoon` | When they're free |
| `{MAX_DISTANCE}` | `15` | Max miles willing to drive |
| `{PREFERENCES}` | `outdoor, educational, budget-friendly` | Optional preferences |

---

## Example Filled Prompt

```
I need you to find the top 20 family activities based on these specific criteria:

**Location:** Seattle, WA
**Children's Ages:** 5, 8
**When Available:** Saturday afternoon
**Maximum Distance:** 15 miles from their location
**Additional Preferences:** outdoor activities, educational but fun, prefer nature-based

Please search the web to find current, real activities that fit these criteria. Consider:
- Age-appropriateness for children aged 5, 8
- Operating hours that match "Saturday afternoon"
- Venues within 15 miles of Seattle, WA
- The specific preferences: outdoor activities, educational but fun, prefer nature-based

For each activity, I need:
1. **Activity Name** - The official name of the venue/activity
2. **Website URL** - Direct link to the venue's website or booking page
3. **Description** - 2-4 sentences explaining:
   - Why it's perfect for this family
   - What makes it age-appropriate
   - How long it typically takes
   - Any special features or highlights
4. **Emoji** - One contextually appropriate emoji that represents the activity
5. **Address** - Full street address for Google Maps

Return EXACTLY 20 activities, ranked from best to worst fit. Prioritize:
- High ratings and recent positive reviews
- Activities that match the availability time slot
- Venues with good facilities for the specified age group
- Variety (mix of indoor/outdoor, active/educational, etc.)

**IMPORTANT:** Return your response as a valid JSON array with this exact structure:

```json
[
  {
    "name": "Activity Name Here",
    "emoji": "🎨",
    "website": "https://example.com",
    "address": "123 Main St, City, State ZIP",
    "description": "Why this is perfect for this family. What makes it age-appropriate. Typical duration. Special highlights."
  }
]
```

Do not include any text before or after the JSON array. Only return the JSON.
```

---

## Backend Implementation Snippet

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SearchParams {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
}

async function searchActivities(params: SearchParams) {
  const { city, kidsAges, availability, maxDistance, preferences } = params;

  const prompt = `I need you to find the top 20 family activities based on these specific criteria:

**Location:** ${city}
**Children's Ages:** ${kidsAges}
**When Available:** ${availability}
**Maximum Distance:** ${maxDistance} miles from their location
**Additional Preferences:** ${preferences || 'None specified'}

Please search the web to find current, real activities that fit these criteria. Consider:
- Age-appropriateness for children aged ${kidsAges}
- Operating hours that match "${availability}"
- Venues within ${maxDistance} miles of ${city}
${preferences ? `- The specific preferences: ${preferences}` : ''}

For each activity, I need:
1. **Activity Name** - The official name of the venue/activity
2. **Website URL** - Direct link to the venue's website or booking page
3. **Description** - 2-4 sentences explaining:
   - Why it's perfect for this family
   - What makes it age-appropriate
   - How long it typically takes
   - Any special features or highlights
4. **Emoji** - One contextually appropriate emoji that represents the activity
5. **Address** - Full street address for Google Maps

Return EXACTLY 20 activities, ranked from best to worst fit. Prioritize:
- High ratings and recent positive reviews
- Activities that match the availability time slot
- Venues with good facilities for the specified age group
- Variety (mix of indoor/outdoor, active/educational, etc.)

**IMPORTANT:** Return your response as a valid JSON array with this exact structure:

\`\`\`json
[
  {
    "name": "Activity Name Here",
    "emoji": "🎨",
    "website": "https://example.com",
    "address": "123 Main St, City, State ZIP",
    "description": "Why this is perfect for this family. What makes it age-appropriate. Typical duration. Special highlights."
  }
]
\`\`\`

Do not include any text before or after the JSON array. Only return the JSON.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    system: "You are a family activity expert who helps parents discover perfect activities for their children. Your recommendations are personalized, practical, and based on current, real information from web searches.",
    tools: [
      {
        type: 'web_search_20250305' as const,
        name: 'web_search',
        max_uses: 15,
        // Optional: Add user location for better search results
        // user_location: {
        //   city: city.split(',')[0],
        //   country: 'USA'
        // }
      }
    ],
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  // Extract the JSON from Claude's response
  const textContent = message.content.find(block => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  // Parse the JSON response
  const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('No JSON array found in response');
  }

  const activities = JSON.parse(jsonMatch[0]);

  return activities;
}
```

---

## Response Processing

After receiving the JSON array, enhance each activity with Google Maps link:

```typescript
interface Activity {
  name: string;
  emoji: string;
  website: string;
  address: string;
  description: string;
}

function addGoogleMapsLinks(activities: Activity[], userCity: string) {
  return activities.map(activity => ({
    ...activity,
    mapsLink: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userCity)}&destination=${encodeURIComponent(activity.address)}`
  }));
}
```

---

## Expected Response Format

```json
[
  {
    "name": "Woodland Park Zoo",
    "emoji": "🦁",
    "website": "https://www.zoo.org",
    "address": "5500 Phinney Ave N, Seattle, WA 98103",
    "description": "Perfect for your 5 and 8 year olds with over 1,000 animals across 92 acres. The zoo offers age-appropriate exhibits and interactive areas. Plan for 3-4 hours to explore. Open Saturday afternoons year-round."
  },
  {
    "name": "Pacific Science Center",
    "emoji": "🔬",
    "website": "https://www.pacificsciencecenter.org",
    "address": "200 2nd Ave N, Seattle, WA 98109",
    "description": "Hands-on science exhibits designed for elementary-aged children with live demonstrations and planetarium shows. Indoor facility perfect for any weather. Typical visit takes 2-3 hours. Great for curious minds."
  }
  // ... 18 more activities
]
```

---

## Testing the Prompt

### Test Cases

**Test 1: Basic Search**
- City: Portland, OR
- Ages: 6
- Availability: Sunday morning
- Distance: 10 miles
- Preferences: (none)

**Test 2: Specific Preferences**
- City: Austin, TX
- Ages: 4, 10
- Availability: Weekday afternoons
- Distance: 20 miles
- Preferences: budget-friendly, educational, STEM-focused

**Test 3: Complex Requirements**
- City: San Francisco, CA
- Ages: 8, 12, 15
- Availability: Saturday all day
- Distance: 25 miles
- Preferences: mix of active and cultural, good for wide age range, accessible by public transit

---

## Error Handling

Handle these scenarios:

1. **No results found:** Ask Claude to expand search radius or broaden criteria
2. **Less than 20 results:** Accept what's available, don't pad with invalid data
3. **Invalid JSON:** Retry with prompt emphasizing JSON format
4. **Missing fields:** Validate and request re-generation with specific field requirements

---

## Optimization Tips

1. **Caching:** Cache results for identical searches (5-10 minute TTL)
2. **Max uses:** Set `max_uses: 15` to allow enough searches without runaway costs
3. **Streaming:** Consider streaming for faster perceived performance
4. **Fallback:** If web search fails, provide graceful error message

---

## Cost Estimate Per Search

- Web search: ~$0.01 per search
- Tokens (8K output): ~$0.03-0.05
- **Total: ~$0.04-0.06 per search**

With 500 searches/month: **~$20-30/month**