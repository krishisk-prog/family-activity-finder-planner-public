import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('🔑 API Key check:', apiKey ? `Found (${apiKey.substring(0, 15)}...)` : 'NOT FOUND');

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({
    apiKey: apiKey,
    timeout: 60000, // 60 seconds timeout
    maxRetries: 2,  // Retry failed requests
  });
}

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

  // Build prompt - using Claude's knowledge instead of web search
  const userPrompt = `I need you to recommend the top 20 family activities based on these specific criteria:

**Location:** ${city}
**Children's Ages:** ${kidsAges}
**When Available:** ${availability}
**Maximum Distance:** ${maxDistance} miles from their location
**Additional Preferences:** ${preferences || 'None specified'}

Based on your knowledge of ${city} and family-friendly activities, please recommend activities that fit these criteria. Consider:
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

  const systemPrompt = `You are a family activity expert who helps parents discover perfect activities for their children. Your recommendations are personalized, practical, and based on your knowledge of popular family-friendly venues, attractions, and activities.`;

  try {
    const anthropic = getAnthropicClient();
    console.log('📡 Calling Claude API (without web search)...');
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      // Removed web search tool - using Claude's built-in knowledge instead
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
