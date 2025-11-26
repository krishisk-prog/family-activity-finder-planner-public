import type { SearchFormData, Activity } from '../types/index';

// Dynamically determine API URL based on current hostname
// This allows the app to work both on localhost and on LAN
function getApiBaseUrl(): string {
  // If VITE_API_URL is set and we're on localhost, use it
  if (import.meta.env.VITE_API_URL && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, use the current hostname with backend port
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost or 192.168.88.36
  const backendPort = 3001;

  return `${protocol}//${hostname}:${backendPort}/api`;
}

const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL to console
console.log('🔍 API Base URL:', API_BASE_URL);
console.log('🌐 Current hostname:', window.location.hostname);
console.log('🔒 Current protocol:', window.location.protocol);

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function searchActivities(
  formData: SearchFormData
): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'Failed to fetch activities',
        response.status,
        data
      );
    }

    return data.activities;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network error
    if (error instanceof TypeError) {
      throw new APIError('Unable to connect to server. Please check your connection.');
    }

    throw new APIError('An unexpected error occurred');
  }
}
