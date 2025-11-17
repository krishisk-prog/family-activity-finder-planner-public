import type { Activity } from '../types/index.ts';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Emoji and Title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-4xl">{activity.emoji}</span>
        <h3 className="text-xl font-bold text-gray-900 flex-1">
          {activity.name}
        </h3>
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
