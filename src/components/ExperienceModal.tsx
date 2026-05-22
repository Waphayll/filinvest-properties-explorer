import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles, Home, ShieldCheck, Tag } from 'lucide-react';
import { Project } from '../types';
import { BRAND_COLORS } from '../constants';
import { cn } from '../lib/utils';

interface ExploreModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExploreModal: React.FC<ExploreModalProps> = ({ project, isOpen, onClose }) => {
  const [view, setView] = React.useState<'details' | 'floor-plan' | 'room-plan'>('details');
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setView('details');
      setSelectedRoom(null);
    }
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-editorial-bg/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl bg-editorial-bg text-editorial-black border border-editorial-black shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 z-50 p-2 bg-editorial-bg border border-editorial-black hover:bg-editorial-black hover:text-editorial-bg transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Content */}
            {view === 'details' && (
            <div className="flex-1 p-12 md:p-16 overflow-y-auto max-h-[80vh] md:max-h-none scrollbar-hide">
              <header className="mb-12">
                <span 
                  className="text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block opacity-80"
                  style={{ color: BRAND_COLORS[project.brand] }}
                >
                  {project.brand} Portfolio
                </span>
                <h1 className="text-5xl md:text-6xl font-display leading-[1.1] mb-6 italic font-bold">
                  {project.name}
                </h1>
                <div className="flex items-center gap-3 opacity-60">
                  <MapPin size={16} />
                  <span className="text-sm font-medium tracking-tight uppercase">
                    {project.location}
                  </span>
                </div>
              </header>

              <div className="space-y-10">
                <section>
                  <p className="text-xl md:text-2xl font-display leading-relaxed italic mb-8 border-l-4 border-editorial-black pl-6">
                    "{project.description}"
                  </p>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-10 border-y border-editorial-black/10">
                  {project.unitTypes && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest opacity-40 uppercase">
                        <Home size={12} />
                        Unit Offerings
                      </div>
                      <p className="text-sm leading-relaxed font-normal">
                        {project.unitTypes}
                      </p>
                    </div>
                  )}

                  {project.amenities && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest opacity-40 uppercase">
                        <Sparkles size={12} />
                        Key Amenities
                      </div>
                      <p className="text-sm leading-relaxed font-normal">
                        {project.amenities}
                      </p>
                    </div>
                  )}

                  {project.highlights && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest opacity-40 uppercase">
                        <ShieldCheck size={12} />
                        Portfolio Highlights
                      </div>
                      <p className="text-sm leading-relaxed font-normal">
                        {project.highlights}
                      </p>
                    </div>
                  )}

                  {project.pricePoint && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest opacity-40 uppercase">
                        <Tag size={12} />
                        Investment Tier
                      </div>
                      <p className="text-sm leading-relaxed font-normal">
                        {project.pricePoint}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-8">
                   <button 
                     onClick={() => setView('floor-plan')}
                     className="w-full md:w-auto px-12 py-5 bg-editorial-black text-editorial-bg uppercase text-xs tracking-[0.3em] font-bold hover:bg-opacity-80 transition-all">
                    View Project
                  </button>
                </div>
              </div>
            </div>
            )}

            {view === 'floor-plan' && (
              <div className="flex-1 p-12 md:p-16 flex flex-col overflow-y-auto max-h-[80vh] md:max-h-none scrollbar-hide">
                <header className="mb-8">
                  <button onClick={() => setView('details')} className="text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:opacity-70 transition-opacity font-bold">
                    <X size={14} /> Back to Details
                  </button>
                  <h2 className="text-4xl font-display italic font-bold">Interactive Floor Plan</h2>
                  <p className="text-sm opacity-60 mt-2">Select a room to view details.</p>
                </header>
                
                <div className="flex-1 flex items-center justify-center bg-editorial-black/5 border border-editorial-black p-8 min-h-[300px]">
                  <div className="w-full max-w-lg aspect-video border-2 border-editorial-black relative bg-editorial-bg p-2 grid grid-cols-3 grid-rows-2 gap-2">
                    <button 
                      onClick={() => { setSelectedRoom('Living Area'); setView('room-plan'); }}
                      className="col-span-2 row-span-1 border border-editorial-black/30 bg-editorial-black/5 hover:bg-editorial-black/10 transition-colors flex items-center justify-center group"
                    >
                      <span className="font-display italic text-lg group-hover:scale-110 transition-transform">Living Area</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedRoom('Master Bedroom'); setView('room-plan'); }}
                      className="col-span-1 row-span-2 border border-editorial-black/30 bg-editorial-black/5 hover:bg-editorial-black/10 transition-colors flex items-center justify-center group"
                    >
                      <span className="font-display italic text-lg group-hover:scale-110 transition-transform text-center">Master<br/>Bedroom</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedRoom('Kitchen & Dining'); setView('room-plan'); }}
                      className="col-span-1 row-span-1 border border-editorial-black/30 bg-editorial-black/5 hover:bg-editorial-black/10 transition-colors flex items-center justify-center group"
                    >
                      <span className="font-display italic text-lg group-hover:scale-110 transition-transform text-center">Kitchen &<br/>Dining</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedRoom('Bathroom'); setView('room-plan'); }}
                      className="col-span-1 row-span-1 border border-editorial-black/30 bg-editorial-black/5 hover:bg-editorial-black/10 transition-colors flex items-center justify-center group"
                    >
                      <span className="font-display italic text-lg group-hover:scale-110 transition-transform">Bathroom</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'room-plan' && (
              <div className="flex-1 p-12 md:p-16 flex flex-col overflow-y-auto max-h-[80vh] md:max-h-none scrollbar-hide">
                <header className="mb-8">
                  <button onClick={() => setView('floor-plan')} className="text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:opacity-70 transition-opacity font-bold">
                    <X size={14} /> Back to Floor Plan
                  </button>
                  <h2 className="text-4xl font-display italic font-bold">{selectedRoom}</h2>
                  <p className="text-sm opacity-60 mt-2">Detailed room specifications.</p>
                </header>

                <div className="flex-1 flex flex-col gap-8">
                  <div className="w-full aspect-video border border-editorial-black bg-editorial-black/5 flex items-center justify-center">
                    <span className="font-display text-xl italic opacity-50 text-center px-4">Detailed layout for {selectedRoom} coming soon</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest opacity-40 uppercase mb-2">Dimensions</div>
                      <p className="text-sm">TBD sq.m</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-widest opacity-40 uppercase mb-2">Finishes</div>
                      <p className="text-sm">Premium Materials</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Image */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto border-t md:border-t-0 md:border-l border-editorial-black overflow-hidden bg-editorial-black/5">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.name}
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <h3 className="font-display text-4xl italic">Visual Experience Coming Soon</h3>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExploreModal;
