import type { SearchFormData, Activity } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
