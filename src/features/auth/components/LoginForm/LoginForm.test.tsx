/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { renderWithProviders } from '@/test/utils';

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    renderWithProviders(<LoginForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('calls onSubmit with the correct values when the form is submitted', async () => {
    renderWithProviders(<LoginForm onSubmit={mockOnSubmit} />);

    // Fill in valid form data
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });
    fireEvent.blur(passwordInput);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('displays an error message when the email is invalid', async () => {
    renderWithProviders(<LoginForm onSubmit={mockOnSubmit} />);

    // Enter invalid email and trigger validation
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' },
    });
    fireEvent.blur(emailInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('displays an error message when the password is too short', async () => {
    renderWithProviders(<LoginForm onSubmit={mockOnSubmit} />);

    // Enter short password and trigger validation
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, {
      target: { value: '1234567' },
    });
    fireEvent.blur(passwordInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('handles remember me checkbox', async () => {
    renderWithProviders(<LoginForm onSubmit={mockOnSubmit} />);

    // Check remember me
    fireEvent.click(screen.getByLabelText('Remember Me'));

    // Fill in valid form data
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });
    fireEvent.blur(passwordInput);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for form submission with remember me checked
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });
  });
});