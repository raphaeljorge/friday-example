import type { ReadingHistoryEntry, ReadingStats } from '../../types';

interface ReadingHistoryProps {
  history: ReadingHistoryEntry[];
  stats: ReadingStats;
  isLoading: boolean;
  onUpdateProgress: (id: string, currentPage: number, notes?: string) => void;
  onAddReview: (id: string, rating: number, review: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onDeleteEntry: (id: string) => void;
}

export function ReadingHistory({
  history,
  stats,
  isLoading,
  onUpdateProgress,
  onAddReview,
  onUpdateTags,
  onDeleteEntry,
}: ReadingHistoryProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8" data-testid="loading-spinner">
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reading Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reading Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Books Read</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalBooksRead}
            </div>
            <div className="text-sm text-gray-500">
              {stats.booksThisYear} this year • {stats.booksThisMonth} this
              month
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Pages Read</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.pagesRead}
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(1)} ★
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Reading Streak</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.readingStreak} days
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Favorite Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteGenres.map((genre) => (
              <span
                key={genre.name}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {genre.name} ({genre.count})
              </span>
            ))}
          </div>
        </div>

        {/* Reading by Month */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Reading Activity
          </h3>
          <div className="flex items-end space-x-2 h-32">
            {stats.readingByMonth.map((month) => {
              const height = `${(month.count / Math.max(...stats.readingByMonth.map((m) => m.count))) * 100}%`;
              return (
                <div
                  key={month.month}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-blue-200 rounded-t"
                    style={{ height }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1">
                    {month.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reading History List */}
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{entry.book.title}</h3>
                <p className="text-gray-600">{entry.book.author}</p>
              </div>
              <div className="flex items-start space-x-2">
                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress */}
              <div>
                <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${(entry.progress.currentPage / entry.progress.totalPages) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>
                      Page {entry.progress.currentPage} of{' '}
                      {entry.progress.totalPages}
                    </span>
                    <span>
                      {Math.round(
                        (entry.progress.currentPage /
                          entry.progress.totalPages) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>

                {/* Update Progress */}
                <div className="mt-2 flex space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={entry.progress.totalPages}
                    className="w-20 px-2 py-1 border rounded"
                    value={entry.progress.currentPage}
                    onChange={(e) =>
                      onUpdateProgress(
                        entry.id,
                        Number(e.target.value),
                        entry.progress.notes
                      )
                    }
                  />
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() =>
                      onUpdateProgress(
                        entry.id,
                        entry.progress.currentPage,
                        prompt('Add notes:', entry.progress.notes) || undefined
                      )
                    }
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Status and Dates */}
              <div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        entry.status === 'completed'
                          ? 'text-green-600'
                          : entry.status === 'in-progress'
                            ? 'text-blue-600'
                            : 'text-red-600'
                      }`}
                    >
                      {entry.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Started:</span>
                    <span>
                      {new Date(entry.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.endDate && (
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">Finished:</span>
                      <span>
                        {new Date(entry.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {entry.progress.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {entry.progress.notes}
                </p>
              </div>
            )}

            {/* Review */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Review</h4>
              {entry.rating ? (
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="text-yellow-400 text-lg">
                      {'★'.repeat(entry.rating)}
                    </div>
                    <div className="text-gray-300 text-lg">
                      {'★'.repeat(5 - entry.rating)}
                    </div>
                  </div>
                  {entry.review && (
                    <p className="mt-1 text-sm text-gray-600">{entry.review}</p>
                  )}
                </div>
              ) : (
                <button
                  className="mt-1 text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    const rating = Number(prompt('Rating (1-5):', '5'));
                    const review = prompt('Review:');
                    if (rating >= 1 && rating <= 5 && review) {
                      onAddReview(entry.id, rating, review);
                    }
                  }}
                >
                  Add Review
                </button>
              )}
            </div>

            {/* Tags */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Tags</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
                <button
                  className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    const tags = prompt(
                      'Enter tags (comma-separated):',
                      entry.tags.join(', ')
                    );
                    if (tags) {
                      onUpdateTags(
                        entry.id,
                        tags.split(',').map((t) => t.trim())
                      );
                    }
                  }}
                >
                  Edit Tags
                </button>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reading history yet. Start reading to track your progress!
          </div>
        )}
      </div>
    </div>
  );
}
