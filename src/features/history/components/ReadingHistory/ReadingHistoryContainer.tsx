import {
  useReadingHistory,
  useReadingStats,
  useUpdateReadingProgress,
  useAddReview,
  useUpdateTags,
  useDeleteReadingHistoryEntry,
} from '../../hooks/useHistory';
import { ReadingHistory } from './ReadingHistory';

export function ReadingHistoryContainer() {
  const { data: history, isLoading: isHistoryLoading } = useReadingHistory();
  const { data: stats, isLoading: isStatsLoading } = useReadingStats();
  const updateProgress = useUpdateReadingProgress();
  const addReview = useAddReview();
  const updateTags = useUpdateTags();
  const deleteEntry = useDeleteReadingHistoryEntry();

  const handleUpdateProgress = (id: string, currentPage: number, notes?: string) => {
    updateProgress.mutate({
      id,
      progress: {
        currentPage,
        notes,
      },
    });
  };

  const handleAddReview = (id: string, rating: number, review: string) => {
    addReview.mutate({
      id,
      review: {
        rating,
        review,
      },
    });
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    updateTags.mutate({
      id,
      tags,
    });
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reading history entry?')) {
      deleteEntry.mutate(id);
    }
  };

  const isLoading = isHistoryLoading || isStatsLoading;

  if (!history?.data || !stats?.data) {
    return <ReadingHistory
      history={[]}
      stats={{
        totalBooksRead: 0,
        booksThisYear: 0,
        booksThisMonth: 0,
        averageRating: 0,
        pagesRead: 0,
        readingStreak: 0,
        favoriteGenres: [],
        readingByMonth: [],
      }}
      isLoading={isLoading}
      onUpdateProgress={handleUpdateProgress}
      onAddReview={handleAddReview}
      onUpdateTags={handleUpdateTags}
      onDeleteEntry={handleDeleteEntry}
    />;
  }

  return (
    <ReadingHistory
      history={history.data}
      stats={stats.data}
      isLoading={isLoading}
      onUpdateProgress={handleUpdateProgress}
      onAddReview={handleAddReview}
      onUpdateTags={handleUpdateTags}
      onDeleteEntry={handleDeleteEntry}
    />
  );
}