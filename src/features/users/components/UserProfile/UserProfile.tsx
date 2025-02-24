import { User } from '../../types';

interface UserProfileProps {
  user: User;
  isLoading: boolean;
  onUpdateProfile: (user: Partial<User>) => void;
}

export function UserProfile({ user, isLoading, onUpdateProfile }: UserProfileProps) {
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="loading-skeleton">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="mt-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="mt-1 flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="mt-2 space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="user-name">{user.name}</h1>
        <p className="text-gray-600" data-testid="user-email">{user.email}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="mt-2">
            <h3 className="text-sm font-medium">Favorite Categories</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {user.preferences.favoriteCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Notification Settings</h3>
          <div className="mt-2 space-y-2">
            <label htmlFor="email-notifications" className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={user.preferences.notificationSettings.email}
                onChange={(e) =>
                  onUpdateProfile({
                    preferences: {
                      ...user.preferences,
                      notificationSettings: {
                        ...user.preferences.notificationSettings,
                        email: e.target.checked,
                      },
                    },
                  })
                }
                id="email-notifications"
              />
              <span className="ml-2 text-sm text-gray-600">Email notifications</span>
            </label>

            <label htmlFor="push-notifications" className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={user.preferences.notificationSettings.push}
                onChange={(e) =>
                  onUpdateProfile({
                    preferences: {
                      ...user.preferences,
                      notificationSettings: {
                        ...user.preferences.notificationSettings,
                        push: e.target.checked,
                      },
                    },
                  })
                }
                id="push-notifications"
              />
              <span className="ml-2 text-sm text-gray-600">Push notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}