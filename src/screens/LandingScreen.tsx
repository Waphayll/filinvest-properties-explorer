import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import anime from 'animejs/lib/anime.es.js';
import { QRCodeSVG } from 'qrcode.react';
import CursorGlow from '../components/CursorGlow';
import { LANDING_BACKDROPS } from '../constants';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [activeLandingBgIndex, setActiveLandingBgIndex] = useState<number>(0);

  // Landing Screen Background Cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLandingBgIndex(prev => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * LANDING_BACKDROPS.length);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animejs hook for Landing Screen staggered entrance
  useEffect(() => {
    anime({
      targets: '.landing-element',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(150),
      easing: 'easeOutExpo',
      duration: 900
    });
  }, []);

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-12 text-center cursor-pointer overflow-hidden z-0 bg-white"
      onClick={onStart}
    >
      <CursorGlow />
      
      {/* Immersive Atmospheric Background Image Backdrop */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={LANDING_BACKDROPS[activeLandingBgIndex]}
            src={LANDING_BACKDROPS[activeLandingBgIndex]}
            alt="Landing backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover scale-102 blur-[0.5px]"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80 pointer-events-none z-10" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(#17179615_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />

      <div className="pt-12 landing-element z-10 flex justify-center">
        <img src="/landing.svg" alt="Filinvest Townships" className="h-16 sm:h-20 md:h-28 lg:h-36 mb-2 object-contain" />
      </div>

      <div className="space-y-6 max-w-3xl px-6 z-10 landing-element">
        <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-[#171796] leading-tight mt-4">
          Invest in a Prime Business Address
        </h1>
        <div className="h-[1px] w-24 bg-[#171796]/30 mx-auto my-6"></div>
        <p className="text-base sm:text-lg text-slate-800 font-sans font-normal max-w-2xl mx-auto leading-relaxed px-4 italic">
          Explore premium commercial lot properties strategically located in prime growth corridors—ideal for businesses, investments, and future-ready developments.
        </p>
      </div>

      <div className="pb-12 z-10 landing-element">
        <button className="px-10 py-4.5 bg-[#171796] hover:bg-blue-800 shadow-lg shadow-[#171796]/20 border-none text-white rounded-none font-medium tracking-widest uppercase text-xs transition-colors animate-pulse cursor-pointer">
          Tap Anywhere to Begin
        </button>
      </div>

      {/* QR Code - Desktop only, far bottom-right */}
      <div className="hidden md:flex flex-col items-center gap-2 pointer-events-none absolute bottom-6 right-8 z-20 landing-element">
        <div className="bg-white p-2.5 rounded-sm shadow-lg shadow-black/10 border border-[#171796]/10">
          <QRCodeSVG
            value="https://filinvest-properties-explorer.vercel.app/"
            size={80}
            bgColor="#ffffff"
            fgColor="#171796"
            level="M"
          />
        </div>
        <span className="text-[8px] text-[#171796]/60 uppercase tracking-[0.2em] font-bold font-sans">
          Scan to open on mobile
        </span>
      </div>
    </motion.div>
  );
};

export default React.memo(LandingScreen);
