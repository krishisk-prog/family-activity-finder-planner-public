import express, { Request, Response } from 'express';
import { searchActivities, type SearchParams } from '../services/claudeService';
import { formatActivities } from '../services/activityFormatter';

const router = express.Router();

router.post('/search', async (req: Request, res: Response) => {
  console.log('📥 Search request received');
  try {
    const { city, kidsAges, availability, maxDistance, preferences } = req.body;
    console.log('📝 Request body:', { city, kidsAges, availability, maxDistance, preferences: preferences || 'none' });

    // Validate required fields
    if (!city || !kidsAges || !availability || !maxDistance) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['city', 'kidsAges', 'availability', 'maxDistance'],
      });
    }

    // Validate data types
    if (typeof city !== 'string' || typeof kidsAges !== 'string' ||
        typeof availability !== 'string' || typeof maxDistance !== 'string') {
      console.log('❌ Validation failed: Invalid field types');
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

    console.log('🤖 Calling Claude service...');
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
