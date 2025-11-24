import Anthropic from '@anthropic-ai/sdk';

// Web search is a server-side tool with a different structure than custom tools
// The SDK types may not include it yet, so we define it ourselves
interface WebSearchTool {
  type: 'web_search_20250305';
  name: 'web_search';
  max_uses?: number;
  allowed_domains?: string[];
  blocked_domains?: string[];
  user_location?: {
    type: 'approximate';
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
  };
}

// Retry configuration for exponential backoff
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelayMs: 1000,  // Start with 1 second
  maxDelayMs: 60000,  // Cap at 60 seconds
};

// Valid event types for filtering
export const EVENT_TYPES = [
  'seasonal',    // Holiday events, seasonal festivals
  'exhibition',  // Museum exhibits, art shows
  'show',        // Performances, concerts, theater
  'class',       // Workshops, classes, camps
  'permanent',   // Regular attractions, ongoing activities
] as const;

export type EventType = typeof EVENT_TYPES[number];

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay for exponential backoff
 * Formula: min(maxDelay, baseDelay * 2^attempt + random jitter)
 */
function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig,
  retryAfterSeconds?: number
): number {
  // If server provided retry-after header, use it (with some buffer)
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    const serverDelay = retryAfterSeconds * 1000 + 500; // Add 500ms buffer
    console.log(`⏰ Server requested retry-after: ${retryAfterSeconds}s`);
    return Math.min(serverDelay, config.maxDelayMs);
  }

  // Exponential backoff: 1s, 2s, 4s, 8s, 16s... capped at maxDelay
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);

  // Add random jitter (0-25% of delay) to prevent thundering herd
  const jitter = Math.random() * 0.25 * exponentialDelay;

  return Math.min(exponentialDelay + jitter, config.maxDelayMs);
}

/**
 * Extract retry-after value from error (if available)
 */
function getRetryAfterFromError(error: unknown): number | undefined {
  if (error instanceof Anthropic.APIError) {
    // Check headers for retry-after
    const headers = error.headers;
    if (headers) {
      const retryAfter = headers['retry-after'];
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds)) {
          return seconds;
        }
      }
    }
  }
  return undefined;
}

/**
 * Check if error is a rate limit error (429)
 */
function isRateLimitError(error: unknown): boolean {
  return error instanceof Anthropic.APIError && error.status === 429;
}

/**
 * Get current date context for time-sensitive searches
 */
function getDateContext(): { dateStr: string; month: string; year: number; season: string } {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();

  // Determine season
  const monthNum = now.getMonth();
  let season: string;
  if (monthNum >= 2 && monthNum <= 4) season = 'spring';
  else if (monthNum >= 5 && monthNum <= 7) season = 'summer';
  else if (monthNum >= 8 && monthNum <= 10) season = 'fall';
  else season = 'winter';

  return { dateStr, month, year, season };
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('🔑 API Key check:', apiKey ? `Found (${apiKey.substring(0, 15)}...)` : 'NOT FOUND');

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({
    apiKey: apiKey,
    timeout: 300000, // 5 minutes timeout
    maxRetries: 0,   // Disable SDK retries, we handle them ourselves
  });
}

export interface SearchParams {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
  eventTypes?: EventType[];  // Optional filter for event types
}

export interface ClaudeActivity {
  name: string;
  emoji: string;
  website: string;
  address: string;
  description: string;
  eventDate?: string;   // e.g., "Nov 15 - Jan 5, 2025" or "Ongoing"
  eventType?: EventType; // Type of event/activity
}

/**
 * Make the actual API call to Claude with streaming and prompt caching
 */
async function makeClaudeRequest(
  anthropic: Anthropic,
  systemPrompt: string,
  userPrompt: string,
  webSearchTool: WebSearchTool
): Promise<Anthropic.Message> {
  console.log('📡 Calling Claude API with web search (streaming mode + prompt caching)...');

  // Use array format for system prompt to enable caching
  // cache_control marks the end of cacheable content
  // Cache reads are 90% cheaper than regular input tokens
  const systemWithCache = [
    {
      type: 'text' as const,
      text: systemPrompt,
      cache_control: { type: 'ephemeral' as const },
    },
  ];

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 12000, // Increased for 20 activities
    system: systemWithCache,
    tools: [webSearchTool] as unknown as Anthropic.Tool[],
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Log streaming events for debugging
  let eventCount = 0;
  stream.on('text', (text) => {
    eventCount++;
    if (eventCount <= 5 || eventCount % 50 === 0) {
      console.log(`📨 Streaming event #${eventCount}: received ${text.length} chars`);
    }
  });

  stream.on('error', (error) => {
    console.error('❌ Stream error:', error);
  });

  console.log('⏳ Waiting for stream to complete...');
  return await stream.finalMessage();
}

/**
 * Execute API call with exponential backoff retry logic
 */
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Only retry on rate limit errors
      if (!isRateLimitError(error)) {
        throw error;
      }

      // Don't retry if we've exhausted attempts
      if (attempt === config.maxRetries) {
        console.error(`❌ Max retries (${config.maxRetries}) exceeded`);
        throw error;
      }

      // Calculate delay with exponential backoff
      const retryAfter = getRetryAfterFromError(error);
      const delayMs = calculateBackoffDelay(attempt, config, retryAfter);

      console.log(`⚠️ Rate limit hit (429). Attempt ${attempt + 1}/${config.maxRetries + 1}`);
      console.log(`⏳ Waiting ${(delayMs / 1000).toFixed(1)}s before retry...`);

      await sleep(delayMs);
      console.log(`🔄 Retrying request...`);
    }
  }

  throw lastError;
}

export async function searchActivities(params: SearchParams): Promise<ClaudeActivity[]> {
  const { city, kidsAges, availability, maxDistance, preferences, eventTypes } = params;

  // Get current date context for time-sensitive searches
  const { dateStr, month, year, season } = getDateContext();
  console.log(`📅 Date context: ${dateStr} (${season})`);

  // Build event type filter instruction
  const eventTypeFilter = eventTypes && eventTypes.length > 0
    ? `\n**Event Types to Include:** ${eventTypes.join(', ')} (focus on these types of activities)`
    : '';

  // Build prompt - using web search for current events and activities
  const userPrompt = `Today is **${dateStr}**. Current season: **${season}**.

I need you to recommend the top 20 family activities and CURRENT EVENTS based on these criteria:

**Location:** ${city}
**Children's Ages:** ${kidsAges}
**When Available:** ${availability}
**Maximum Distance:** ${maxDistance} miles from their location
**Additional Preferences:** ${preferences || 'None specified'}${eventTypeFilter}

## IMPORTANT: Search for TIME-SENSITIVE EVENTS

Please search for CURRENT and UPCOMING events, not just generic venues. Use searches like:
- "${city} events ${month} ${year}"
- "${city} family events this weekend"
- "${city} ${season} activities for kids"
- Check venue event pages directly (e.g., zoo events, museum exhibitions, science center shows)

Prioritize:
1. **Current/upcoming special events** (holiday events, seasonal festivals, limited-time exhibitions)
2. **This weekend's activities** matching "${availability}"
3. **Seasonal activities** appropriate for ${season}
4. Permanent attractions as backup options

For each activity, I need:
1. **Activity/Event Name** - Be specific! Include event names, not just venue names
   - Good: "WildLanterns at Woodland Park Zoo"
   - Bad: "Woodland Park Zoo"
2. **Website URL** - Direct link to the event page if available
3. **Description** - 2-4 sentences including:
   - What makes this event special or timely
   - Age-appropriateness for children aged ${kidsAges}
   - Duration and any special highlights
4. **Emoji** - One contextually appropriate emoji
5. **Address** - Full street address
6. **Event Date** - When the event runs (e.g., "Nov 15 - Jan 5, 2025") or "Ongoing" for permanent attractions
7. **Event Type** - One of: seasonal, exhibition, show, class, permanent

Return EXACTLY 20 activities, ranked by relevance and timeliness. Include a mix of:
- Time-limited events (seasonal, exhibitions, shows)
- Permanent attractions with current special programming
- Regular family-friendly venues

**IMPORTANT:** Return your response as a valid JSON array with this exact structure:

\`\`\`json
[
  {
    "name": "WildLanterns at Woodland Park Zoo",
    "emoji": "🏮",
    "website": "https://www.zoo.org/wildlanterns",
    "address": "5500 Phinney Ave N, Seattle, WA 98103",
    "description": "A magical lantern festival featuring illuminated animal sculptures. Perfect for your 6-year-old with interactive light displays. Runs evenings only, allow 1.5-2 hours.",
    "eventDate": "Nov 15, 2024 - Jan 19, 2025",
    "eventType": "seasonal"
  }
]
\`\`\`

Do not include any text before or after the JSON array. Only return the JSON.`;

  // Extended system prompt for event discovery
  const systemPrompt = `You are a family activity expert who helps parents discover perfect activities and CURRENT EVENTS for their children. You excel at finding time-sensitive, seasonal, and special events - not just generic venue recommendations.

## Your Role
You specialize in finding:
- Current and upcoming special events
- Seasonal festivals and holiday activities
- Limited-time exhibitions and shows
- Timely activities that match the user's availability

## Search Strategy
When searching for activities, use multiple targeted searches:
1. Search for "[city] events [current month] [year]" to find current happenings
2. Search for "[city] family events this weekend" for immediate options
3. Search for specific venue event pages: "[venue name] events" or "[venue name] calendar"
4. Search for seasonal events: "[city] [season] activities for families"
5. Check major venue websites directly (zoos, museums, science centers, theaters)

## Event Discovery Priority
1. **Time-limited events** - These are most valuable as they won't be available later
2. **Seasonal/holiday events** - Relevant to current time of year
3. **Special exhibitions** - Limited-run museum or venue exhibits
4. **Shows and performances** - Scheduled entertainment
5. **Permanent attractions** - Only as backup, and mention any current special programming

## Response Quality Standards
- Always include the specific event name, not just the venue
- Verify event dates are current (not past events)
- Include direct links to event pages when available
- Specify whether events are ongoing or limited-time
- Categorize each activity by type (seasonal, exhibition, show, class, permanent)

## Output Format
Always return valid JSON arrays with complete information for each activity including eventDate and eventType fields. Never include markdown formatting, explanations, or commentary outside the JSON structure.`;

  // Configure the web search tool with increased uses for event discovery
  const webSearchTool: WebSearchTool = {
    type: 'web_search_20250305',
    name: 'web_search',
    max_uses: 5, // Increased from 3 to allow deeper event searches
  };

  try {
    const anthropic = getAnthropicClient();

    // Execute with exponential backoff retry
    const message = await executeWithRetry(() =>
      makeClaudeRequest(anthropic, systemPrompt, userPrompt, webSearchTool)
    );

    console.log('✅ Stream completed!');
    console.log('🔍 Response stop reason:', message.stop_reason);
    console.log('📊 Usage:', JSON.stringify(message.usage, null, 2));

    // Log cache performance
    const usage = message.usage as {
      input_tokens: number;
      output_tokens: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
    if (usage.cache_read_input_tokens) {
      console.log(`💾 Cache HIT: ${usage.cache_read_input_tokens} tokens read from cache (90% savings)`);
    }
    if (usage.cache_creation_input_tokens) {
      console.log(`📝 Cache WRITE: ${usage.cache_creation_input_tokens} tokens cached for future requests`);
    }

    // Log content block types for debugging
    const blockTypes = message.content.map((block) => block.type);
    console.log('📦 Content block types:', blockTypes);

    // Extract text content from response
    const textBlocks = message.content.filter((block) => block.type === 'text');
    if (textBlocks.length === 0) {
      throw new Error('No text content in Claude response');
    }

    // Combine all text content
    const fullText = textBlocks
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    console.log('📝 Combined text length:', fullText.length);

    // Parse JSON from response
    const jsonMatch = fullText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ No JSON found. Response text:', fullText.substring(0, 500));
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

    console.log(`✅ Successfully parsed ${activities.length} activities`);
    return activities;
  } catch (error) {
    console.error('Claude API Error:', error);
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error: ${error.status} ${error.message}`);
    }
    throw error;
  }
}
