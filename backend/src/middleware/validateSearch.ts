/**
 * Validation Middleware for Search Requests
 *
 * Validates and sanitizes search parameters to ensure:
 * - Data integrity
 * - Security (prevent injection attacks)
 * - API cost control (prevent excessive searches)
 */

import { Request, Response, NextFunction } from 'express';

// Valid event types
const VALID_EVENT_TYPES = ['seasonal', 'exhibition', 'show', 'class', 'permanent'];

/**
 * Validation error response
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Sanitize string input - remove potentially dangerous characters
 */
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[^\w\s,.-]/g, ''); // Allow only alphanumeric, spaces, commas, periods, hyphens
}

/**
 * Validate city name
 */
function validateCity(city: string): ValidationError | null {
  if (!city || typeof city !== 'string') {
    return { field: 'city', message: 'City is required' };
  }

  const trimmed = city.trim();

  if (trimmed.length < 2) {
    return { field: 'city', message: 'City name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { field: 'city', message: 'City name must be less than 100 characters' };
  }

  // Check for valid characters (letters, spaces, commas, hyphens)
  const cityRegex = /^[a-zA-Z\s,.-]+$/;
  if (!cityRegex.test(trimmed)) {
    return {
      field: 'city',
      message: 'City name can only contain letters, spaces, commas, periods, and hyphens',
    };
  }

  return null;
}

/**
 * Validate and parse kids ages
 * Supports formats: "5", "5, 8", "3-7"
 */
function validateKidsAges(ages: string): ValidationError | null {
  if (!ages || typeof ages !== 'string') {
    return { field: 'kidsAges', message: 'Kids ages are required' };
  }

  const trimmed = ages.trim();

  // Parse ages (can be "5, 8" or "3-7")
  const ageRegex = /^[\d\s,.-]+$/;
  if (!ageRegex.test(trimmed)) {
    return {
      field: 'kidsAges',
      message: 'Kids ages must be numbers separated by commas or ranges (e.g., "5, 8" or "3-7")',
    };
  }

  // Extract individual ages
  const ageValues: number[] = [];

  // Handle range format "3-7"
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-').map((s) => s.trim());
    if (parts.length === 2) {
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return { field: 'kidsAges', message: 'Invalid age range format' };
      }

      if (start > end) {
        return { field: 'kidsAges', message: 'Age range start must be less than end' };
      }

      // Don't need to populate full range, just validate boundaries
      ageValues.push(start, end);
    }
  } else {
    // Handle comma-separated format "5, 8, 12"
    const parts = trimmed.split(',').map((s) => s.trim());
    for (const part of parts) {
      const age = parseInt(part, 10);
      if (isNaN(age)) {
        return { field: 'kidsAges', message: `Invalid age: "${part}"` };
      }
      ageValues.push(age);
    }
  }

  // Validate age range (1-18 years)
  for (const age of ageValues) {
    if (age < 1 || age > 18) {
      return {
        field: 'kidsAges',
        message: 'Ages must be between 1 and 18 years',
      };
    }
  }

  return null;
}

/**
 * Validate max distance
 */
function validateMaxDistance(distance: string): ValidationError | null {
  if (!distance || typeof distance !== 'string') {
    return { field: 'maxDistance', message: 'Max distance is required' };
  }

  const trimmed = distance.trim();
  const distanceNum = parseInt(trimmed, 10);

  if (isNaN(distanceNum)) {
    return { field: 'maxDistance', message: 'Max distance must be a number' };
  }

  if (distanceNum < 1 || distanceNum > 500) {
    return {
      field: 'maxDistance',
      message: 'Max distance must be between 1 and 500 miles',
    };
  }

  return null;
}

/**
 * Validate availability
 */
function validateAvailability(availability: string): ValidationError | null {
  if (!availability || typeof availability !== 'string') {
    return { field: 'availability', message: 'Availability is required' };
  }

  const trimmed = availability.trim();

  if (trimmed.length < 3) {
    return {
      field: 'availability',
      message: 'Availability must be at least 3 characters',
    };
  }

  if (trimmed.length > 200) {
    return {
      field: 'availability',
      message: 'Availability must be less than 200 characters',
    };
  }

  return null;
}

/**
 * Validate preferences (optional field)
 */
function validatePreferences(preferences: string | undefined): ValidationError | null {
  if (!preferences) {
    return null; // Optional field
  }

  if (typeof preferences !== 'string') {
    return { field: 'preferences', message: 'Preferences must be a string' };
  }

  const trimmed = preferences.trim();

  if (trimmed.length > 500) {
    return {
      field: 'preferences',
      message: 'Preferences must be less than 500 characters',
    };
  }

  return null;
}

/**
 * Validate event types (optional field)
 */
function validateEventTypes(eventTypes: string[] | undefined): ValidationError | null {
  if (!eventTypes) {
    return null; // Optional field
  }

  if (!Array.isArray(eventTypes)) {
    return { field: 'eventTypes', message: 'Event types must be an array' };
  }

  for (const type of eventTypes) {
    if (!VALID_EVENT_TYPES.includes(type)) {
      return {
        field: 'eventTypes',
        message: `Invalid event type: "${type}". Must be one of: ${VALID_EVENT_TYPES.join(', ')}`,
      };
    }
  }

  return null;
}

/**
 * Express middleware to validate search request
 */
export function validateSearchRequest(req: Request, res: Response, next: NextFunction): void {
  const { city, kidsAges, availability, maxDistance, preferences, eventTypes } = req.body;

  const errors: ValidationError[] = [];

  // Validate each field
  const cityError = validateCity(city);
  if (cityError) errors.push(cityError);

  const agesError = validateKidsAges(kidsAges);
  if (agesError) errors.push(agesError);

  const availabilityError = validateAvailability(availability);
  if (availabilityError) errors.push(availabilityError);

  const distanceError = validateMaxDistance(maxDistance);
  if (distanceError) errors.push(distanceError);

  const preferencesError = validatePreferences(preferences);
  if (preferencesError) errors.push(preferencesError);

  const eventTypesError = validateEventTypes(eventTypes);
  if (eventTypesError) errors.push(eventTypesError);

  // If there are validation errors, return 400
  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      errors: errors,
    });
    return;
  }

  // Sanitize string inputs
  req.body.city = sanitizeString(city);
  req.body.kidsAges = kidsAges.trim();
  req.body.availability = availability.trim();
  req.body.maxDistance = maxDistance.trim();
  req.body.preferences = preferences ? preferences.trim() : '';

  // Continue to next middleware
  next();
}
