import { CoinListItem } from '@/src/features/coins/components/CoinListItem';
import type { Coin } from '@/src/shared/types/api.types';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockCoin: Coin = {
  id: 'btc-123',
  code: 'btc',
  dirtyCode: 'BTC',
  name: 'Bitcoin',
  slug: 'bitcoin',
  priceInUSD: 67890.12,
  availableSupply: 19500000,
  totalSupply: 21000000,
  marketCapRank: 1,
  volume24hInUSD: 25000000000,
  marketCapInUSD: 1300000000000,
  percentChange1h: 0.5,
  percentChange24h: -2.3,
  percentChange7d: 4.1,
  showDisclaimer: false,
};

describe('CoinListItem', () => {
  it('renders the coin name', () => {
    render(<CoinListItem coin={mockCoin} />);
    expect(screen.getByText('Bitcoin')).toBeTruthy();
  });

  it('renders the coin symbol', () => {
    render(<CoinListItem coin={mockCoin} />);
    expect(screen.getByText('BTC')).toBeTruthy();
  });

  it('renders the price', () => {
    render(<CoinListItem coin={mockCoin} />);
    expect(screen.getByText('$67,890.12')).toBeTruthy();
  });

  it('renders a low-value price correctly', () => {
    const cheapCoin: Coin = {
      ...mockCoin,
      priceInUSD: 0.00042,
      name: 'CheapCoin',
      dirtyCode: 'CHEAP',
    };
    render(<CoinListItem coin={cheapCoin} />);
    expect(screen.getByText('CheapCoin')).toBeTruthy();
    expect(screen.getByText('CHEAP')).toBeTruthy();
  });
});
