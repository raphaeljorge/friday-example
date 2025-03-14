import { Suspense } from 'react';
import { ReservationList } from '../ReservationList';
import {
  useCancelReservation,
  useReservations,
  useUpdateReservation,
} from '../../hooks/useReservations';

export default function Reservations() {
  const { data, isLoading, error } = useReservations();
  const cancelReservation = useCancelReservation();
  const updateReservation = useUpdateReservation();

  const handleCancelReservation = async (id: string) => {
    try {
      await cancelReservation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
      // Here you would typically show a toast notification
    }
  };

  const handleUpdateReservation = async (
    id: string,
    status: 'confirmed' | 'cancelled'
  ) => {
    try {
      await updateReservation.mutateAsync({
        id,
        status,
      });
    } catch (err) {
      console.error('Failed to update reservation:', err);
      // Here you would typically show a toast notification
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading reservations. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Reservations</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-white shadow rounded-lg p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <ReservationList
              reservations={data?.data ?? []}
              onCancelReservation={handleCancelReservation}
              onUpdateReservation={handleUpdateReservation}
            />
          )}
        </div>
      </Suspense>
    </div>
  );
}
