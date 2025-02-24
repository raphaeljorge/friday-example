/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Shelf } from './Shelf';
import { renderWithProviders } from '@/test/utils';

const mockShelves = [
  {
    id: '1',
    name: 'Test Shelf 1',
    description: 'Test Description 1',
    books: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
  },
  {
    id: '2',
    name: 'Test Shelf 2',
    description: 'Test Description 2',
    books: [],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-04',
  },
];

describe('Shelf', () => {
  const mockOnCreateShelf = vi.fn();
  const mockOnDeleteShelf = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders shelves correctly', () => {
    renderWithProviders(
      <Shelf
        shelves={mockShelves}
        isLoading={false}
        onCreateShelf={mockOnCreateShelf}
        onDeleteShelf={mockOnDeleteShelf}
      />,
      { initialPath: '/shelf' }
    );

    // Check shelf names and descriptions
    expect(screen.getByText('Test Shelf 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Shelf 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();

    // Check book counts
    expect(screen.getByText('0 books • Created 1/1/2024')).toBeInTheDocument();
    expect(screen.getByText('0 books • Created 1/3/2024')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    renderWithProviders(
      <Shelf
        shelves={[]}
        isLoading={true}
        onCreateShelf={mockOnCreateShelf}
        onDeleteShelf={mockOnDeleteShelf}
      />,
      { initialPath: '/shelf' }
    );

    // Check for skeleton loading elements
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(document.querySelectorAll('.h-24.bg-gray-200.rounded')).toHaveLength(3);
  });

  it('renders empty state when no shelves', () => {
    renderWithProviders(
      <Shelf
        shelves={[]}
        isLoading={false}
        onCreateShelf={mockOnCreateShelf}
        onDeleteShelf={mockOnDeleteShelf}
      />,
      { initialPath: '/shelf' }
    );

    expect(screen.getByText('No shelves created yet. Click "Create New Shelf" to get started.')).toBeInTheDocument();
  });

  it('calls onCreateShelf when create button is clicked', async () => {
    const name = 'New Shelf';
    const description = 'New Description';
    
    // Mock window.prompt
    vi.spyOn(window, 'prompt')
      .mockImplementationOnce(() => name)
      .mockImplementationOnce(() => description);

    renderWithProviders(
      <Shelf
        shelves={mockShelves}
        isLoading={false}
        onCreateShelf={mockOnCreateShelf}
        onDeleteShelf={mockOnDeleteShelf}
      />,
      { initialPath: '/shelf' }
    );

    fireEvent.click(screen.getByText('Create New Shelf'));

    expect(mockOnCreateShelf).toHaveBeenCalledTimes(1);
    expect(mockOnCreateShelf).toHaveBeenCalledWith(name, description);
  });

  it('calls onDeleteShelf when delete button is clicked', () => {
    renderWithProviders(
      <Shelf
        shelves={mockShelves}
        isLoading={false}
        onCreateShelf={mockOnCreateShelf}
        onDeleteShelf={mockOnDeleteShelf}
      />,
      { initialPath: '/shelf' }
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteShelf).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteShelf).toHaveBeenCalledWith(mockShelves[0].id);
  });
});