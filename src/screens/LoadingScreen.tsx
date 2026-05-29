import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COMMERCIAL_PROJECTS } from '../constants';
import { useAssetPreloader } from '../hooks/useAssetPreloader';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const { loadingProgress } = useAssetPreloader(true, onLoaded);
  const [activeLoadingLogoIndex, setActiveLoadingLogoIndex] = useState<number>(0);

  // Loading Screen Logo Cycling
  useEffect(() => {
    const loadingLogos = COMMERCIAL_PROJECTS.map(p => p.logoImage).filter(Boolean) as string[];
    if (loadingLogos.length === 0) return;

    const interval = setInterval(() => {
      setActiveLoadingLogoIndex(prev => (prev + 1) % loadingLogos.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-50 bg-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#17179615_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />
      
      <div className="z-10 h-32 md:h-40 relative flex items-center justify-center w-full max-w-sm mb-12">
        <AnimatePresence mode="wait">
          {(() => {
            const loadingLogos = COMMERCIAL_PROJECTS.map(p => p.logoImage).filter(Boolean) as string[];
            const currentLogo = loadingLogos.length > 0 ? loadingLogos[activeLoadingLogoIndex] : '';
            return currentLogo ? (
              <motion.img
                key={currentLogo}
                src={currentLogo}
                alt="Loading logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute object-contain max-w-full max-h-full h-24 md:h-28"
              />
            ) : null;
          })()}
        </AnimatePresence>
      </div>

      <div className="z-10 w-48 md:w-64 space-y-4">
        <div className="h-[2px] w-full bg-[#171796]/10 overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-[#171796]"
            initial={{ width: '0%' }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>
        <div className="text-[9px] md:text-[10px] text-[#171796]/60 uppercase tracking-[0.3em] font-sans font-bold flex justify-between">
          <span>Loading Assets</span>
          <span>{loadingProgress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(LoadingScreen);
