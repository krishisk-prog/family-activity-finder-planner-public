import type { ClaudeActivity, EventType } from './claudeService';

export interface FormattedActivity {
  id: number;
  name: string;
  emoji: string;
  website: string;
  googleSearchLink: string;
  address: string;
  googleMapsLink: string;
  appleMapsLink: string;
  description: string;
  eventDate?: string;     // e.g., "Nov 15 - Jan 5, 2025" or "Ongoing"
  eventType?: EventType;  // seasonal, exhibition, show, class, permanent
}

function generateGoogleSearchLink(activityName: string, city: string): string {
  const query = encodeURIComponent(`${activityName} ${city}`);
  return `https://www.google.com/search?q=${query}`;
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
    googleSearchLink: generateGoogleSearchLink(activity.name, userCity),
    address: activity.address,
    googleMapsLink: generateGoogleMapsLink(userCity, activity.address),
    appleMapsLink: generateAppleMapsLink(userCity, activity.address),
    description: activity.description,
    eventDate: activity.eventDate,
    eventType: activity.eventType,
  }));
}
