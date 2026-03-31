import { ErrorState } from '@/src/shared/components/ErrorState';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('ErrorState', () => {
  it('renders the error message', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Network error" onRetry={onRetry} />);

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('renders a retry button', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Network error" onRetry={onRetry} />);

    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('calls onRetry when the retry button is pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Network error" onRetry={onRetry} />);

    fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
