// Valid event types for filtering
export const EVENT_TYPES = [
  'seasonal',    // Holiday events, seasonal festivals
  'exhibition',  // Museum exhibits, art shows
  'show',        // Performances, concerts, theater
  'class',       // Workshops, classes, camps
  'permanent',   // Regular attractions, ongoing activities
] as const;

export type EventType = typeof EVENT_TYPES[number];

// Human-readable labels for event types
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  seasonal: 'Seasonal & Holiday',
  exhibition: 'Exhibitions',
  show: 'Shows & Performances',
  class: 'Classes & Workshops',
  permanent: 'Permanent Attractions',
};

export interface Activity {
  id: number;
  name: string;
  emoji: string;
  website: string;
  address: string;
  googleMapsLink: string;
  appleMapsLink: string;
  description: string;
  eventDate?: string;     // e.g., "Nov 15 - Jan 5, 2025" or "Ongoing"
  eventType?: EventType;  // Type of event/activity
}

export interface SearchFormData {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
  eventTypes?: EventType[];  // Optional filter for event types
}
