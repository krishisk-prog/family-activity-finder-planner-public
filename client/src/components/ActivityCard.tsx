import type { Activity, EventType } from '../types/index.ts';
import { EVENT_TYPE_LABELS } from '../types/index.ts';

interface ActivityCardProps {
  activity: Activity;
}

// Badge colors for different event types
const eventTypeBadgeColors: Record<EventType, string> = {
  seasonal: 'bg-orange-100 text-orange-800',
  exhibition: 'bg-purple-100 text-purple-800',
  show: 'bg-pink-100 text-pink-800',
  class: 'bg-green-100 text-green-800',
  permanent: 'bg-gray-100 text-gray-800',
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const isLimitedTime = activity.eventDate && activity.eventDate !== 'Ongoing';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Emoji and Title */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-4xl">{activity.emoji}</span>
        <h3 className="text-xl font-bold text-gray-900 flex-1">
          {activity.name}
        </h3>
      </div>

      {/* Event Date and Type Badges */}
      <div className="flex flex-wrap gap-2 mb-3 ml-12">
        {activity.eventDate && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isLimitedTime
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isLimitedTime ? '📅 ' : '🔄 '}
            {activity.eventDate}
          </span>
        )}
        {activity.eventType && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              eventTypeBadgeColors[activity.eventType]
            }`}
          >
            {EVENT_TYPE_LABELS[activity.eventType]}
          </span>
        )}
      </div>

      {/* Links - Compact on desktop, touch-friendly on mobile */}
      <div className="flex flex-wrap items-center gap-1 md:gap-3 mb-4 text-sm">
        <a
          href={activity.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:bg-blue-50 md:hover:bg-transparent md:hover:underline font-medium px-3 py-2 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors min-h-[44px] md:min-h-0"
        >
          <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>Website</span>
        </a>
        <span className="text-gray-400 hidden md:inline">|</span>
        <a
          href={activity.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:bg-blue-50 md:hover:bg-transparent md:hover:underline font-medium px-3 py-2 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors min-h-[44px] md:min-h-0"
        >
          <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Google Maps</span>
        </a>
        <span className="text-gray-400 hidden md:inline">|</span>
        <a
          href={activity.appleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:bg-blue-50 md:hover:bg-transparent md:hover:underline font-medium px-3 py-2 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors min-h-[44px] md:min-h-0"
        >
          <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Apple Maps</span>
        </a>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
    </div>
  );
}
