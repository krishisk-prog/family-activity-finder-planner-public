import { useState, useEffect, FormEvent } from 'react';
import type { SearchFormData, EventType } from '../types/index.ts';
import { EVENT_TYPES, EVENT_TYPE_LABELS } from '../types/index.ts';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void;
}

const STORAGE_KEY = 'family-activity-last-search';

export default function SearchForm({ onSubmit }: SearchFormProps) {
  // Load saved search from localStorage
  const [savedSearch, setSavedSearch, clearSavedSearch] = useLocalStorage<SearchFormData | null>(
    STORAGE_KEY,
    null
  );

  const [formData, setFormData] = useState<SearchFormData>({
    city: '',
    kidsAges: savedSearch?.kidsAges || '',
    availability: savedSearch?.availability || '',
    maxDistance: savedSearch?.maxDistance || '',
    preferences: savedSearch?.preferences || '',
    eventTypes: savedSearch?.eventTypes || [], // Empty means show all types
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Auto-detect location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetectingLocation(true);
      setLocationError(null);

      // Try GPS geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // GPS Success
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              // Reverse geocode GPS coordinates to city name
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );

              if (!response.ok) {
                throw new Error('Failed to fetch location data');
              }

              const data = await response.json();
              const cityName = data.city || data.locality;
              const stateName = data.principalSubdivision;
              const locationString = stateName
                ? `${cityName}, ${stateName}`
                : cityName;

              setFormData((prev) => ({
                ...prev,
                city: locationString,
              }));
              setIsDetectingLocation(false);
            } catch (error) {
              // GPS worked but reverse geocoding failed, try IP fallback
              tryIPGeolocation();
            }
          },
          // GPS Error - fall back to IP geolocation
          () => {
            tryIPGeolocation();
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      } else {
        // Browser doesn't support geolocation, use IP fallback
        tryIPGeolocation();
      }
    };

    // IP-based geolocation fallback
    const tryIPGeolocation = async () => {
      try {
        const response = await fetch(
          'https://api.bigdatacloud.net/data/ip-geolocation?key=bdc_2dd7b11fcd0a4ff98ba1ddf5b8bcff07'
        );

        if (!response.ok) {
          throw new Error('IP geolocation failed');
        }

        const data = await response.json();
        const cityName = data.city || data.locality;
        const stateName = data.principalSubdivision;
        const locationString = stateName
          ? `${cityName}, ${stateName}`
          : cityName || 'Location unavailable';

        setFormData((prev) => ({
          ...prev,
          city: locationString,
        }));
        setIsDetectingLocation(false);
      } catch (error) {
        // If location detection completely fails, use saved city if available
        if (savedSearch?.city) {
          setFormData((prev) => ({
            ...prev,
            city: savedSearch.city,
          }));
          setLocationError('Using previously saved location. You can edit if needed.');
        } else {
          setLocationError('Unable to detect location. Please enter manually.');
        }
        setIsDetectingLocation(false);
      }
    };

    detectLocation();
  }, []); // Run once on mount
  // Note: Empty dependency array is correct - we only want to run once
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Save search to localStorage for next time
    setSavedSearch(formData);

    onSubmit(formData);
  };

  const handleClearSaved = () => {
    if (confirm('Clear saved search data? You\'ll need to re-enter your preferences next time.')) {
      clearSavedSearch();
      // Reset form to defaults (except city which may be auto-detected)
      setFormData((prev) => ({
        city: prev.city, // Keep current city (might be auto-detected)
        kidsAges: '',
        availability: '',
        maxDistance: '',
        preferences: '',
        eventTypes: [],
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEventTypeChange = (eventType: EventType) => {
    setFormData((prev) => {
      const currentTypes = prev.eventTypes || [];
      const isSelected = currentTypes.includes(eventType);

      return {
        ...prev,
        eventTypes: isSelected
          ? currentTypes.filter((t) => t !== eventType)
          : [...currentTypes, eventType],
      };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="space-y-4">
        {/* City Input */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            City/Location *
            {isDetectingLocation && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                (Detecting...)
              </span>
            )}
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder={
              isDetectingLocation
                ? 'Detecting your location...'
                : 'e.g., Seattle, WA'
            }
            disabled={isDetectingLocation}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-wait"
          />
          {locationError && (
            <p className="mt-1 text-sm text-amber-600" role="alert">
              {locationError}
            </p>
          )}
          {!isDetectingLocation && formData.city && !locationError && (
            <p className="mt-1 text-sm text-green-600">
              ✓ Location detected. You can edit if needed.
            </p>
          )}
        </div>

        {/* Kids Ages Input */}
        <div>
          <label
            htmlFor="kidsAges"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kids Ages *
          </label>
          <input
            type="text"
            id="kidsAges"
            name="kidsAges"
            required
            value={formData.kidsAges}
            onChange={handleChange}
            placeholder="e.g., 5, 8 or 3-7"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        {/* Availability Input */}
        <div>
          <label
            htmlFor="availability"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            When Available *
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            required
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g., Saturday afternoon"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        {/* Max Distance Input */}
        <div>
          <label
            htmlFor="maxDistance"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Maximum Distance (miles) *
          </label>
          <input
            type="number"
            id="maxDistance"
            name="maxDistance"
            required
            min="1"
            value={formData.maxDistance}
            onChange={handleChange}
            placeholder="How far will you drive?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Types (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Leave empty for all types, or select specific types to filter
          </p>
          <div className="space-y-2">
            {EVENT_TYPES.map((eventType) => (
              <label
                key={eventType}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.eventTypes?.includes(eventType) || false}
                  onChange={() => handleEventTypeChange(eventType)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {EVENT_TYPE_LABELS[eventType]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferences Input */}
        <div>
          <label
            htmlFor="preferences"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferences (Optional)
          </label>
          <textarea
            id="preferences"
            name="preferences"
            rows={3}
            value={formData.preferences}
            onChange={handleChange}
            placeholder="e.g., outdoor, educational, budget-friendly"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 shadow-sm"
        >
          Find Activities
        </button>

        {/* Clear Saved Search Button */}
        {savedSearch && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleClearSaved}
              className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear Saved Search
            </button>
            <p className="text-xs text-gray-500 text-center mt-1">
              Your search preferences are saved automatically
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
