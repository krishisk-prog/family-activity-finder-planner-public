export interface Activity {
  id: number;
  name: string;
  emoji: string;
  website: string;
  address: string;
  googleMapsLink: string;
  appleMapsLink: string;
  description: string;
}

export interface SearchFormData {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
}
