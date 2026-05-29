import { useEffect } from 'react';

export const useInactivityTimeout = (isActive: boolean, onTimeout: () => void, timeoutMs: number = 180000) => {
  useEffect(() => {
    if (!isActive) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        onTimeout();
      }, timeoutMs);
    };

    resetIdleTimer();

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'wheel', 'touchmove'];
    const handleActivity = () => resetIdleTimer();
    
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isActive, onTimeout, timeoutMs]);
};
