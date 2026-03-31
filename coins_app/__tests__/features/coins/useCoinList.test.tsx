import { useCoinList } from '@/src/features/coins/hooks/useCoinList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

const mockCoin = {
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

describe('useCoinList', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns loading state initially', () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    const { result } = renderHook(() => useCoinList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns data on successful fetch', async () => {
    const mockResponse = {
      meta: { success: true, totalCoinCount: 1 },
      data: [mockCoin],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useCoinList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0].data[0].name).toBe('Bitcoin');
    expect(result.current.data?.pages[0].meta.totalCoinCount).toBe(1);
  });

  it('returns error state on fetch failure', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useCoinList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('indicates next page is available when more coins exist', async () => {
    const mockResponse = {
      meta: { success: true, totalCoinCount: 100 },
      data: [mockCoin],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useCoinList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('indicates no next page when all coins are loaded', async () => {
    const mockResponse = {
      meta: { success: true, totalCoinCount: 1 },
      data: [mockCoin],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useCoinList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
