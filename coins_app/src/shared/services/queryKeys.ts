export const queryKeys = {
  coins: {
    all: ['coins'] as const,
    list: () => [...queryKeys.coins.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.coins.all, 'detail', id] as const,
  },
};
