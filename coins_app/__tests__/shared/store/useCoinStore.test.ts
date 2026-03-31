import { useCoinStore } from '@/src/shared/store/useCoinStore';

describe('useCoinStore', () => {
  beforeEach(() => {
    useCoinStore.setState({ lastUpdatedTimestamps: {} });
  });

  it('starts with empty timestamps', () => {
    const state = useCoinStore.getState();
    expect(state.lastUpdatedTimestamps).toEqual({});
  });

  it('sets the last-updated timestamp for a coin', () => {
    const before = Date.now();
    useCoinStore.getState().setLastUpdated('bitcoin-123');
    const after = Date.now();

    const timestamp = useCoinStore.getState().getLastUpdated('bitcoin-123');
    expect(timestamp).toBeDefined();
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('returns undefined for a coin without a timestamp', () => {
    const timestamp = useCoinStore.getState().getLastUpdated('unknown-coin');
    expect(timestamp).toBeUndefined();
  });

  it('updates the timestamp on subsequent calls', () => {
    useCoinStore.getState().setLastUpdated('btc');
    const first = useCoinStore.getState().getLastUpdated('btc');

    useCoinStore.getState().setLastUpdated('btc');
    const second = useCoinStore.getState().getLastUpdated('btc');

    expect(second).toBeGreaterThanOrEqual(first!);
  });

  it('maintains separate timestamps for different coins', () => {
    useCoinStore.getState().setLastUpdated('btc');
    useCoinStore.getState().setLastUpdated('eth');

    const btcTimestamp = useCoinStore.getState().getLastUpdated('btc');
    const ethTimestamp = useCoinStore.getState().getLastUpdated('eth');

    expect(btcTimestamp).toBeDefined();
    expect(ethTimestamp).toBeDefined();
  });
});
