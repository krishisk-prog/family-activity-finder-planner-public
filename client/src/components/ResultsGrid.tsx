import type { Activity } from '../types/index.ts';
import ActivityCard from './ActivityCard';

interface ResultsGridProps {
  activities: Activity[];
}

export default function ResultsGrid({ activities }: ResultsGridProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Results Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Found {activities.length} activities for you
      </h2>

      {/* Grid of Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
