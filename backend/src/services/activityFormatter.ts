import type { ClaudeActivity } from './claudeService';

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
