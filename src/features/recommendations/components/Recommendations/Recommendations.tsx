import { BookCard } from '@/features/books/components/BookCard';
import { usePreferencesStore } from '../../store/preferencesStore';
import type { RecommendationGroup, DismissRecommendationRequest } from '../../types';

interface RecommendationsProps {
  groups: RecommendationGroup[];
  isLoading: boolean;
  onDismiss: (recommendationId: string, request: DismissRecommendationRequest) => void;
  onRefresh: () => void;
}

export function Recommendations({
  groups,
  isLoading,
  onDismiss,
  onRefresh,
}: RecommendationsProps) {
  const {
    enabledSources,
    toggleSource,
    minScore,
    setMinScore,
    maxRecommendations,
    setMaxRecommendations,
    excludedCategories,
    addExcludedCategory,
    removeExcludedCategory,
    excludedAuthors,
    addExcludedAuthor,
    removeExcludedAuthor,
  } = usePreferencesStore();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Preferences Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommendation Preferences</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={onRefresh}
          >
            Refresh Recommendations
          </button>
        </div>

        {/* Sources */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'reading-history', label: 'Reading History' },
              { id: 'favorite-genres', label: 'Favorite Genres' },
              { id: 'similar-books', label: 'Similar Books' },
              { id: 'popular', label: 'Popular' },
              { id: 'trending', label: 'Trending' },
              { id: 'new-releases', label: 'New Releases' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`px-3 py-1 rounded-full text-sm ${
                  enabledSources.includes(id as any)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => toggleSource(id as any)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Score</h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{(minScore * 100).toFixed(0)}%</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Maximum Recommendations per Group
            </h3>
            <input
              type="number"
              min="1"
              max="20"
              value={maxRecommendations}
              onChange={(e) => setMaxRecommendations(Number(e.target.value))}
              className="w-24 px-3 py-1 border rounded"
            />
          </div>
        </div>

        {/* Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded Categories</h3>
            <div className="flex flex-wrap gap-2">
              {excludedCategories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center"
                >
                  {category}
                  <button
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => removeExcludedCategory(category)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  const category = prompt('Enter category to exclude:');
                  if (category) addExcludedCategory(category);
                }}
              >
                + Add Category
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded Authors</h3>
            <div className="flex flex-wrap gap-2">
              {excludedAuthors.map((author) => (
                <span
                  key={author}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center"
                >
                  {author}
                  <button
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => removeExcludedAuthor(author)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  const author = prompt('Enter author to exclude:');
                  if (author) addExcludedAuthor(author);
                }}
              >
                + Add Author
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Groups */}
      {groups.map((group) => (
        <div key={group.source} className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-semibold">{group.title}</h2>
            <p className="text-sm text-gray-600">{group.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.recommendations.map((recommendation) => (
              <div key={recommendation.id} className="relative">
                <BookCard book={recommendation.book} />
                <div className="absolute top-2 right-2">
                  <button
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                    onClick={() => {
                      const reasonInput = prompt(
                        'Why do you want to dismiss this recommendation?\n(not-interested, already-read, wrong-genre, wrong-author, inappropriate, other)',
                        'not-interested'
                      );
                      if (!reasonInput) return;

                      const reason = reasonInput as DismissRecommendationRequest['reason'];
                      const noteInput = prompt('Any additional notes?');
                      const note = noteInput || undefined;

                      onDismiss(recommendation.id, { reason, note });
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">{recommendation.reason}</div>
                  <div className="text-xs text-gray-500">
                    Score: {(recommendation.score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {group.recommendations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No recommendations available in this group
            </div>
          )}
        </div>
      ))}

      {groups.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No recommendations available. Try adjusting your preferences or refreshing.
        </div>
      )}
    </div>
  );
}