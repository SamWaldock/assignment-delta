import { CoinDetailCard } from '@/src/features/coin-detail/components/CoinDetailCard';
import type { Coin } from '@/src/shared/types/api.types';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

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

describe('CoinDetailCard', () => {
  it('renders the coin name', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('Bitcoin')).toBeTruthy();
  });

  it('renders the coin symbol', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('BTC')).toBeTruthy();
  });

  it('renders the price', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('$67,890.12')).toBeTruthy();
  });

  it('renders the market cap rank', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('#1')).toBeTruthy();
  });

  it('renders positive percent change with a + prefix', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('+0.50%')).toBeTruthy();
  });

  it('renders negative percent change without a + prefix', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.getByText('-2.30%')).toBeTruthy();
  });

  it('does not render the disclaimer when showDisclaimer is false', () => {
    render(<CoinDetailCard coin={mockCoin} />);
    expect(screen.queryByText(/low liquidity/i)).toBeNull();
  });

  it('renders the disclaimer when showDisclaimer is true', () => {
    render(<CoinDetailCard coin={{ ...mockCoin, showDisclaimer: true }} />);
    expect(screen.getByText(/low liquidity/i)).toBeTruthy();
  });
});
