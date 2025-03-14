import type { Reservation } from '../../types';

interface ReservationListProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onUpdateReservation: (id: string, status: 'confirmed' | 'cancelled') => void;
}

export function ReservationList({
  reservations,
  onCancelReservation,
  onUpdateReservation,
}: ReservationListProps) {
  const activeReservations = reservations.filter(
    (res) => res.status === 'pending' || res.status === 'confirmed'
  );
  const pastReservations = reservations.filter(
    (res) => res.status === 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Active Reservations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Active Reservations</h2>
          <div className="text-sm text-gray-500">
            {activeReservations.length} active
          </div>
        </div>

        <div className="border rounded-lg divide-y">
          {activeReservations.length === 0 ? (
            <div className="p-4">
              <p className="text-gray-600">No active reservations</p>
            </div>
          ) : (
            activeReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    Pickup: {reservation.pickupDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {reservation.status}
                  </div>
                  {reservation.notes && (
                    <div className="text-sm text-gray-600">
                      Notes: {reservation.notes}
                    </div>
                  )}
                </div>
                <div className="space-x-2">
                  {reservation.status === 'pending' && (
                    <button
                      onClick={() =>
                        onUpdateReservation(reservation.id, 'confirmed')
                      }
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() => onCancelReservation(reservation.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reservation History */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reservation History</h2>
          <div className="text-sm text-gray-500">
            {pastReservations.length} past
          </div>
        </div>

        <div className="border rounded-lg divide-y">
          {pastReservations.length === 0 ? (
            <div className="p-4">
              <p className="text-gray-600">No past reservations</p>
            </div>
          ) : (
            pastReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    Pickup: {reservation.pickupDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {reservation.status}
                  </div>
                  {reservation.notes && (
                    <div className="text-sm text-gray-600">
                      Notes: {reservation.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
