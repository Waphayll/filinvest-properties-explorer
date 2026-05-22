import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface LandingScreenProps {
  onEnter: () => void;
}

export default function LandingScreen({ onEnter }: LandingScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grid background texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#f8fafc 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center px-8 max-w-3xl"
      >
        {/* Brand */}
        <div className="text-[11px] uppercase tracking-[0.5em] opacity-40 mb-8 font-bold">
          Q2 Investors Night · 2025
        </div>

        <div className="mb-2 opacity-60 text-sm tracking-[0.3em] uppercase font-bold">Filinvest Townships</div>
        <h1 className="text-6xl md:text-8xl font-display font-bold italic leading-none mb-6 tracking-tight">
          Commercial<br />Portfolio
        </h1>

        <p className="text-base opacity-50 leading-relaxed mb-16 max-w-md font-medium">
          Explore available commercial lots across Filinvest's premier townships.
          Select a project to view lot details and availability.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="flex items-center gap-4 px-12 py-5 bg-editorial-black text-editorial-bg uppercase text-xs tracking-[0.4em] font-bold hover:opacity-90 transition-opacity"
        >
          Select a Project
          <ChevronRight size={16} />
        </motion.button>
      </motion.div>

      {/* Bottom label */}
      <div className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] opacity-20 font-bold">
        Filinvest Alabang Inc. · {new Date().getFullYear()}
      </div>
    </div>
  );
}
