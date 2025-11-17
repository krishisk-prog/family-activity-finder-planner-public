export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Message */}
      <p className="text-lg text-gray-600 font-medium">
        Finding perfect activities for your family...
      </p>
    </div>
  );
}
