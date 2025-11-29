import { useEffect, useState } from 'react';

// Skeleton card that mimics ActivityCard structure
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Emoji and Title Skeleton */}
      <div className="flex items-start gap-3 mb-2">
        {/* Emoji placeholder */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        {/* Title placeholder */}
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Badges Skeleton */}
      <div className="flex flex-wrap gap-2 mb-3 ml-12">
        <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Links Skeleton */}
      <div className="flex gap-3 mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-100 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

// Loading messages that cycle through
const loadingMessages = [
  'Searching for family-friendly activities...',
  'Checking event dates and availability...',
  'Finding age-appropriate options...',
  'Discovering hidden gems in your area...',
  'Almost there! Compiling your perfect list...',
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through loading messages every 2 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    // Simulate progress (visual feedback only, not actual API progress)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90% until actual completion
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="mb-6 text-center">
        {/* Animated Search Icon */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-lg text-gray-700 font-medium mb-2 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Finding activities ({Math.min(Math.floor(progress), 90)}%)
          </p>
        </div>
      </div>

      {/* Skeleton Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        {/* Show 4th skeleton on larger screens */}
        <div className="hidden lg:block">
          <SkeletonCard />
        </div>
      </div>

      {/* Helpful Tip */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 italic">
          💡 Tip: We're searching live events and venues to find the perfect match for your family
        </p>
      </div>
    </div>
  );
}
