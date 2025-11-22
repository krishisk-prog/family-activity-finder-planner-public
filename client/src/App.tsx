import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsGrid from './components/ResultsGrid';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import type { Activity, SearchFormData } from './types/index.ts';
import { searchActivities } from './services/api';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formData: SearchFormData) => {
    console.log('Search parameters:', formData);

    setIsLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const results = await searchActivities(formData);
      setActivities(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to find activities. Please try again.'
      );
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full Width */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            Family Activity Finder
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Discover perfect activities for your family
          </p>
        </div>
      </header>

      {/* Split-Pane Layout */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Left Pane - Search Form (30-40% width on desktop) */}
        <aside className="w-full md:w-2/5 lg:w-1/3 px-4 py-6 sm:px-6">
          <div className="md:sticky md:top-6">
            <SearchForm onSubmit={handleSearch} />
          </div>
        </aside>

        {/* Right Pane - Results (60-70% width on desktop) */}
        <main className="flex-1 px-4 py-6 sm:px-6">
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} onRetry={handleRetry} />}
          {!isLoading && !error && hasSearched && <ResultsGrid activities={activities} />}
          {!hasSearched && !error && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">
                Enter your search criteria to find family activities
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
