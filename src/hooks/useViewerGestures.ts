import { useEffect, MutableRefObject } from 'react';

export const useViewerGestures = (isActive: boolean, onBackNavigation: () => void, isWipingRef: MutableRefObject<boolean>) => {
  useEffect(() => {
    if (!isActive) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let twoFingerStartX = 0;
    let twoFingerStartY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTwoFingerSwipe = false;
    let startDistance = 0;
    let maxDistanceDiff = 0;

    const triggerBackNavigation = () => {
      const container = document.getElementById('viewer-scroll-container');
      if (container) {
        if (container.scrollLeft > 50) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (!isWipingRef.current) {
          onBackNavigation();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTwoFingerSwipe = false;
      } else if (e.touches.length === 2) {
        twoFingerStartX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        twoFingerStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        lastTouchX = twoFingerStartX;
        lastTouchY = twoFingerStartY;
        
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDistance = Math.sqrt(dx * dx + dy * dy);
        maxDistanceDiff = 0;
        isTwoFingerSwipe = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isTwoFingerSwipe) {
        lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const distDiff = Math.abs(currentDistance - startDistance);
        if (distDiff > maxDistanceDiff) {
          maxDistanceDiff = distDiff;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTwoFingerSwipe) {
        const deltaX = lastTouchX - twoFingerStartX;
        const deltaY = lastTouchY - twoFingerStartY;
        
        // Detect horizontal two-finger swipe right. Must not be a zoom/pinch gesture (distance diff < 40px)
        if (deltaX > 80 && Math.abs(deltaY) < 100 && maxDistanceDiff < 40) {
          triggerBackNavigation();
        }
        isTwoFingerSwipe = false;
        return;
      }
    };

    let lastViewerWheel = 0;
    const handleViewerWheel = (e: WheelEvent) => {
      // Touchpad scrolling (two-finger scroll) generates horizontal wheel events (negative deltaX is swipe right)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.deltaX < -15) {
        const now = Date.now();
        if (now - lastViewerWheel < 600) return; 
        
        triggerBackNavigation();
        lastViewerWheel = now;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true });
    window.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });
    window.addEventListener('wheel', handleViewerWheel, { capture: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('wheel', handleViewerWheel, { capture: true });
    };
  }, [isActive, onBackNavigation, isWipingRef]);
};
