import express, { Request, Response } from 'express';
import { searchActivities, type SearchParams, type EventType } from '../services/claudeService';
import { formatActivities, type FormattedActivity } from '../services/activityFormatter';
import { validateSearchRequest } from '../middleware/validateSearch';
import { activityCache, generateCacheKey } from '../services/cacheService';

const router = express.Router();

// Apply validation middleware to search endpoint
router.post('/search', validateSearchRequest, async (req: Request, res: Response) => {
  console.log('📥 Search request received');
  try {
    const { city, kidsAges, availability, maxDistance, preferences, eventTypes } = req.body;
    console.log('📝 Request body:', {
      city,
      kidsAges,
      availability,
      maxDistance,
      preferences: preferences || 'none',
      eventTypes: eventTypes || 'all',
    });

    // Generate cache key
    const cacheKey = generateCacheKey({
      city,
      kidsAges,
      availability,
      maxDistance,
      preferences,
      eventTypes,
    });

    // Check cache first
    const cachedResults = activityCache.get(cacheKey);
    if (cachedResults) {
      console.log('✨ Returning cached results');
      console.log(`💾 Cache stats: ${activityCache.size()} entries cached`);
      return res.json({
        success: true,
        cached: true,
        count: cachedResults.length,
        activities: cachedResults,
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
      eventTypes: eventTypes as EventType[],
    };

    console.log('🤖 Calling Claude service...');
    const activities = await searchActivities(searchParams);
    console.log(`✅ Found ${activities.length} activities`);

    // Add map links and IDs
    const formattedActivities = formatActivities(activities, city);

    // Store in cache for future requests
    activityCache.set(cacheKey, formattedActivities);
    console.log(`💾 Cached results for future requests (${activityCache.size()} total cached)`);

    res.json({
      success: true,
      cached: false,
      count: formattedActivities.length,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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
