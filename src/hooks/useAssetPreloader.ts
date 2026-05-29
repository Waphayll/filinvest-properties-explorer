import { useState, useEffect } from 'react';
import { COMMERCIAL_PROJECTS } from '../constants';

export const useAssetPreloader = (isActive: boolean, onComplete: () => void) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const urlsToPreload: string[] = [
      '/landing.svg',
      '/lasalle.jpg',
      ...(COMMERCIAL_PROJECTS.map(p => p.carouselImage).filter(Boolean) as string[]),
      ...(COMMERCIAL_PROJECTS.map(p => p.bgImage).filter(Boolean) as string[]),
      ...(COMMERCIAL_PROJECTS.map(p => p.logoImage).filter(Boolean) as string[]),
      ...(COMMERCIAL_PROJECTS.map(p => p.conceptMapSvg ? `/${p.conceptMapSvg}` : '').filter(Boolean) as string[])
    ];

    let loadedCount = 0;
    const totalCount = urlsToPreload.length;

    // Persist loaded images in the window object to prevent aggressive browser garbage collection
    if (!(window as any).__preloadedImages) {
      (window as any).__preloadedImages = [];
    }

    const handleLoad = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / totalCount) * 100));
      if (loadedCount === totalCount) {
        setTimeout(() => onComplete(), 800); // Brief pause at 100%
      }
    };

    urlsToPreload.forEach(url => {
      const img = new Image();
      img.src = url;
      // Force hardware decoding before resolving the load
      if (img.decode) {
        img.decode().then(handleLoad).catch(handleLoad);
      } else {
        img.onload = handleLoad;
        img.onerror = handleLoad;
      }
      (window as any).__preloadedImages.push(img);
    });

    const timeout = setTimeout(() => {
      onComplete();
    }, 15000); // 15 seconds max

    return () => clearTimeout(timeout);
  }, [isActive, onComplete]);

  return { loadingProgress };
};
