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
  const [isFormCollapsed, setIsFormCollapsed] = useState(false); // Mobile form collapse state

  const handleSearch = async (formData: SearchFormData) => {
    console.log('Search parameters:', formData);

    setIsLoading(true);
    setHasSearched(true);
    setError(null);

    // Collapse form on mobile after search (better UX for viewing results)
    setIsFormCollapsed(true);

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
    setIsFormCollapsed(false); // Show form again for retry
  };

  const toggleForm = () => {
    setIsFormCollapsed(!isFormCollapsed);
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

      {/* Mobile Toggle Button - Only visible on mobile when form is collapsed */}
      {isFormCollapsed && hasSearched && (
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <button
              onClick={toggleForm}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-sm min-h-[44px]"
              aria-label="Show search form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Modify Search
            </button>
          </div>
        </div>
      )}

      {/* Split-Pane Layout */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Left Pane - Search Form (30-40% width on desktop, collapsible on mobile) */}
        <aside
          className={`w-full md:w-2/5 lg:w-1/3 px-4 py-6 sm:px-6 transition-all duration-300 ${
            isFormCollapsed ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="md:sticky md:top-6">
            <SearchForm onSubmit={handleSearch} />

            {/* Mobile: Collapse button after search */}
            {hasSearched && !isFormCollapsed && (
              <div className="mt-4 md:hidden">
                <button
                  onClick={toggleForm}
                  className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300 min-h-[44px]"
                  aria-label="Hide search form"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Hide Search
                </button>
              </div>
            )}
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
