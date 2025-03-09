/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserProfile } from './UserProfile';
import { renderWithProviders } from '@/test/utils';
import type { User } from '../../types';

const mockUser: User = {
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

describe('UserProfile', () => {
  const mockOnUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user profile correctly', () => {
    render(
      <UserProfile
        user={mockUser}
        isLoading={false}
        onUpdateProfile={mockOnUpdateProfile}
      />
    );

    // Check user details
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );

    // Check favorite categories
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();

    // Check notification settings
    const emailCheckbox = screen.getByRole('checkbox', {
      name: 'Email notifications',
    });
    const pushCheckbox = screen.getByRole('checkbox', {
      name: 'Push notifications',
    });
    expect(emailCheckbox).toBeChecked();
    expect(pushCheckbox).not.toBeChecked();
  });

  it('renders loading state', () => {
    render(
      <UserProfile
        user={mockUser}
        isLoading={true}
        onUpdateProfile={mockOnUpdateProfile}
      />
    );

    // Check for loading skeleton
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('handles notification setting changes', () => {
    render(
      <UserProfile
        user={mockUser}
        isLoading={false}
        onUpdateProfile={mockOnUpdateProfile}
      />
    );

    // Toggle email notifications
    const emailCheckbox = screen.getByRole('checkbox', {
      name: 'Email notifications',
    });
    fireEvent.click(emailCheckbox);
    expect(mockOnUpdateProfile).toHaveBeenCalledWith({
      preferences: {
        ...mockUser.preferences,
        notificationSettings: {
          ...mockUser.preferences.notificationSettings,
          email: false,
        },
      },
    });

    // Toggle push notifications
    const pushCheckbox = screen.getByRole('checkbox', {
      name: 'Push notifications',
    });
    fireEvent.click(pushCheckbox);
    expect(mockOnUpdateProfile).toHaveBeenCalledWith({
      preferences: {
        ...mockUser.preferences,
        notificationSettings: {
          ...mockUser.preferences.notificationSettings,
          push: true,
        },
      },
    });
  });
});
