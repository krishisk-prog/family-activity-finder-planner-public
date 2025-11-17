/**
 * Generates a Google Maps directions URL from origin to destination
 * @param origin - Starting location (e.g., "Seattle, WA")
 * @param destination - Destination address
 * @returns Google Maps URL for directions
 */
export function generateGoogleMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}`;
}

/**
 * Generates an Apple Maps directions URL from origin to destination
 * @param origin - Starting location (e.g., "Seattle, WA")
 * @param destination - Destination address
 * @returns Apple Maps URL for directions
 */
export function generateAppleMapsLink(origin: string, destination: string): string {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDest = encodeURIComponent(destination);
  return `https://maps.apple.com/?daddr=${encodedDest}&saddr=${encodedOrigin}`;
}

/**
 * @deprecated Use generateGoogleMapsLink instead
 * Generates a Google Maps directions URL (backward compatibility)
 */
export function generateMapsLink(origin: string, destination: string): string {
  return generateGoogleMapsLink(origin, destination);
}
