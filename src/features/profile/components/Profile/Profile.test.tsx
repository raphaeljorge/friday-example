/** @vitest-environment jsdom */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Profile from './index';
import { renderWithProviders } from '@/test/utils';
import * as userHooks from '@/features/users/hooks/useUser';

describe('Profile', () => {
  it('renders loading state', () => {
    vi.spyOn(userHooks, 'useUserProfile').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    vi.spyOn(userHooks, 'useUpdateUserProfile').mockReturnValue({
      mutate: vi.fn(),
    } as any);

    renderWithProviders(<Profile />, { initialPath: '/profile' });

    // The loading skeleton should be visible
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    vi.spyOn(userHooks, 'useUserProfile').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    vi.spyOn(userHooks, 'useUpdateUserProfile').mockReturnValue({
      mutate: vi.fn(),
    } as any);

    renderWithProviders(<Profile />, { initialPath: '/profile' });

    // The error message should be visible
    await waitFor(() => {
      const errorElement = screen.getByText(
        'Error loading profile. Please try again later.'
      );
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass('text-red-600');
    });
  });

  it('renders user profile', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      preferences: {
        favoriteCategories: ['Fiction', 'Science'],
        notificationSettings: {
          email: true,
          push: false,
        },
      },
    };

    vi.spyOn(userHooks, 'useUserProfile').mockReturnValue({
      data: {
        data: mockUser,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(userHooks, 'useUpdateUserProfile').mockReturnValue({
      mutate: vi.fn(),
    } as any);

    renderWithProviders(<Profile />, { initialPath: '/profile' });

    // Wait for the profile to be rendered
    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    // Check user info is displayed
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    // Check preferences section
    expect(screen.getByText('Preferences')).toBeInTheDocument();

    // Check favorite categories
    expect(screen.getByText('Favorite Categories')).toBeInTheDocument();
    mockUser.preferences.favoriteCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });

    // Check notification settings
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    const emailCheckbox = screen.getByLabelText(
      'Email notifications'
    ) as HTMLInputElement;
    const pushCheckbox = screen.getByLabelText(
      'Push notifications'
    ) as HTMLInputElement;
    expect(emailCheckbox.checked).toBe(true);
    expect(pushCheckbox.checked).toBe(false);
  });
});
