import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useCoin } from '@/src/features/coin-detail/hooks/useCoin';

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

describe('useCoin', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns loading state initially', () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    const { result } = renderHook(() => useCoin('btc-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns data on successful fetch', async () => {
    const mockResponse = {
      meta: { success: true },
      data: {
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
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useCoin('btc-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data.name).toBe('Bitcoin');
    expect(result.current.data?.data.priceInUSD).toBe(67890.12);
  });

  it('returns error state on fetch failure', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useCoin('bad-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('does not fetch when id is empty', () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    renderHook(() => useCoin(''), {
      wrapper: createWrapper(),
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
