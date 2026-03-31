import { LastUpdatedBanner } from '@/src/features/coin-detail/components/LastUpdatedBanner';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

const TIMESTAMP = 1_700_000_000_000; // fixed point in time

describe('LastUpdatedBanner', () => {
  it('renders nothing when timestamp is undefined', () => {
    const { toJSON } = render(<LastUpdatedBanner timestamp={undefined} />);
    expect(toJSON()).toBeNull();
  });

  it('renders the "Last updated at" label when a timestamp is provided', () => {
    render(<LastUpdatedBanner timestamp={TIMESTAMP} />);
    expect(screen.getByText(/Last updated at/i)).toBeTruthy();
  });

  it('renders the formatted time matching the component output', () => {
    const expected = new Date(TIMESTAMP).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    render(<LastUpdatedBanner timestamp={TIMESTAMP} />);
    expect(screen.getByText(`Last updated at ${expected}`)).toBeTruthy();
  });
});
