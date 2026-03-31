import { CACHE_GC_TIME, COIN_LIST_STALE_TIME } from '@/src/constants/config';
import { fetchCoins } from '@/src/shared/services/api';
import { queryKeys } from '@/src/shared/services/queryKeys';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useCoinList = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.coins.list(),
    queryFn: ({ pageParam }) => fetchCoins(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (acc, page) => acc + page.data.length,
        0,
      );
      if (totalLoaded >= lastPage.meta.totalCoinCount) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: COIN_LIST_STALE_TIME,
    gcTime: CACHE_GC_TIME,
  });
};
