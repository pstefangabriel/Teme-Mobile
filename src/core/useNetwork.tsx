import { useEffect, useState } from 'react';
import { getLogger } from './logger';

const log = getLogger('useNetwork');

export interface NetworkStatus {
  connected: boolean;
}

export const useNetwork: () => { networkStatus: NetworkStatus } = () => {
  const [connected, setConnected] = useState<boolean>(navigator.onLine);

  // Log initial state on mount for visibility
  useEffect(() => {
    log('init', connected ? 'online' : 'offline');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Listen to browser online/offline events to reflect current connectivity
    const onlineHandler = () => {
      log('event: online');
      setConnected(true);
    };
    const offlineHandler = () => {
      log('event: offline');
      setConnected(false);
    };

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  useEffect(() => {
    // Fallback: some environments (e.g., DevTools offline toggle) may not always
    // dispatch online/offline events immediately. Poll navigator.onLine so the UI
    // reacts instantly even without a network request occurring.
    const intervalId = window.setInterval(() => {
      const now = navigator.onLine;
      if (now !== connected) {
        log('poll detected change', now ? 'online' : 'offline');
        setConnected(now);
      }
    }, 500);
    return () => window.clearInterval(intervalId);
  }, [connected]);

  return { networkStatus: { connected } };
};
