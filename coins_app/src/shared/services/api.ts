import { API_BASE_URL, PAGE_SIZE } from '@/src/constants/config';
import type {
  CoinDetailResponse,
  CoinsListResponse,
} from '@/src/shared/types/api.types';

export const fetchCoins = async (
  page: number,
  pageSize: number = PAGE_SIZE,
): Promise<CoinsListResponse> => {
  const url = `${API_BASE_URL}/web/coins?page[number]=${page}&page[size]=${pageSize}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch coins (status ${response.status})`);
  }

  return response.json() as Promise<CoinsListResponse>;
};

export const fetchCoinDetail = async (
  id: string,
): Promise<CoinDetailResponse> => {
  const url = `${API_BASE_URL}/web/coins/${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch coin detail (status ${response.status})`);
  }

  return response.json() as Promise<CoinDetailResponse>;
};
