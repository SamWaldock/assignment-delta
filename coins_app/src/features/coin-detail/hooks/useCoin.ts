import { CACHE_GC_TIME, COIN_DETAIL_STALE_TIME } from '@/src/constants/config';
import { fetchCoinDetail } from '@/src/shared/services/api';
import { queryKeys } from '@/src/shared/services/queryKeys';
import { useCoinStore } from '@/src/shared/store/useCoinStore';
import { useQuery } from '@tanstack/react-query';

export const useCoin = (id: string) => {
  return useQuery({
    queryKey: queryKeys.coins.detail(id),
    queryFn: async () => {
      const data = await fetchCoinDetail(id);
      useCoinStore.getState().setLastUpdated(id);
      return data;
    },
    staleTime: COIN_DETAIL_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    enabled: !!id,
  });
};
