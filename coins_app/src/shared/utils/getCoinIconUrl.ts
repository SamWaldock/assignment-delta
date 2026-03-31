import { COIN_ICON_BASE_URL } from '@/src/constants/config';

export const getCoinIconUrl = (id: string): string => {
  return `${COIN_ICON_BASE_URL}/${id}/icon-64.png`;
};
