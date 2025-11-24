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

      {/* Links */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <a
          href={activity.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Website
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={activity.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Google Maps
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={activity.appleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Apple Maps
        </a>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
    </div>
  );
}
