/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Recommendations } from './Recommendations';
import { renderWithProviders } from '@/test/utils';
import type { RecommendationGroup, RecommendationReason } from '../../types';
import { usePreferencesStore } from '../../store/preferencesStore';

// Mock the preferences store
vi.mock('../../store/preferencesStore', () => ({
  usePreferencesStore: vi.fn(),
}));

const mockPreferences = {
  enabledSources: ['reading-history'],
  toggleSource: vi.fn(),
  minScore: 0.5,
  setMinScore: vi.fn(),
  maxRecommendations: 10,
  setMaxRecommendations: vi.fn(),
  excludedCategories: [],
  addExcludedCategory: vi.fn(),
  removeExcludedCategory: vi.fn(),
  excludedAuthors: [],
  addExcludedAuthor: vi.fn(),
  removeExcludedAuthor: vi.fn(),
};

const mockGroups: RecommendationGroup[] = [
  {
    source: 'reading-history',
    title: 'Based on Your Reading History',
    description: 'Books similar to ones you\'ve read',
    recommendations: [
      {
        id: '1',
        book: {
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
          isbn: '1234567890',
          coverImage: 'test.jpg',
          description: 'Test Description',
          publishedDate: '2024-01-01',
          publisher: 'Test Publisher',
          categories: ['Fiction'],
          tags: ['bestseller'],
          status: 'available',
          copies: {
            total: 1,
            available: 1,
          },
        },
        source: 'reading-history',
        reason: 'based-on-history' as RecommendationReason,
        score: 0.85,
        timestamp: '2024-01-01T00:00:00Z',
      },
    ],
  },
];

describe('Recommendations', () => {
  const mockOnDismiss = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePreferencesStore).mockReturnValue(mockPreferences);
  });

  it('renders loading state', () => {
    renderWithProviders(
      <Recommendations 
        groups={[]} 
        isLoading={true} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    // Check for skeleton loading elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders recommendations and preferences', () => {
    renderWithProviders(
      <Recommendations 
        groups={mockGroups} 
        isLoading={false} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    // Check preferences panel
    expect(screen.getByText('Recommendation Preferences')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('Reading History')).toBeInTheDocument();
    expect(screen.getByText('Minimum Score')).toBeInTheDocument();

    // Check recommendation group
    expect(screen.getByText('Based on Your Reading History')).toBeInTheDocument();
    expect(screen.getByText('Books similar to ones you\'ve read')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Score: 85%')).toBeInTheDocument();
  });

  it('renders no recommendations message when empty', () => {
    renderWithProviders(
      <Recommendations 
        groups={[]} 
        isLoading={false} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    expect(screen.getByText('No recommendations available. Try adjusting your preferences or refreshing.')).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    renderWithProviders(
      <Recommendations 
        groups={mockGroups} 
        isLoading={false} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    fireEvent.click(screen.getByText('Refresh Recommendations'));
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('handles source toggle', () => {
    renderWithProviders(
      <Recommendations 
        groups={mockGroups} 
        isLoading={false} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    fireEvent.click(screen.getByText('Reading History'));
    expect(mockPreferences.toggleSource).toHaveBeenCalledWith('reading-history');
  });

  it('handles recommendation dismissal', () => {
    vi.spyOn(window, 'prompt')
      .mockImplementationOnce(() => 'not-interested')
      .mockImplementationOnce(() => 'Not my type of book');

    renderWithProviders(
      <Recommendations 
        groups={mockGroups} 
        isLoading={false} 
        onDismiss={mockOnDismiss} 
        onRefresh={mockOnRefresh} 
      />
    );

    const dismissButton = screen.getByText('×');
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledWith('1', {
      reason: 'not-interested',
      note: 'Not my type of book'
    });
  });
});