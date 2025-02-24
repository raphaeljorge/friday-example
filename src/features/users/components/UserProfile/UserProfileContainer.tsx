import { useUserProfile, useUpdateUserProfile } from '../../hooks/useUser';
import { UserProfile } from './UserProfile';
import type { User } from '../../types';

export function UserProfileContainer() {
  const { data: response, isLoading, error } = useUserProfile();
  const updateProfile = useUpdateUserProfile();

  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    updateProfile.mutate(updatedUser);
  };

  if (isLoading) {
    return (
      <div data-testid="loading-skeleton" className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center" role="alert">
        Error loading profile. Please try again later.
      </div>
    );
  }

  if (!response?.data) {
    return null;
  }

  return (
    <UserProfile
      user={response.data}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}