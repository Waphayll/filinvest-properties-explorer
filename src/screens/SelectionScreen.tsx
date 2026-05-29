import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import anime from 'animejs/lib/anime.es.js';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';
import { CommercialProject } from '../types';
import { COMMERCIAL_PROJECTS } from '../constants';

interface SelectionScreenProps {
  onBackToLanding: () => void;
  onProjectSelect: (project: CommercialProject) => void;
  activeCarouselIndex: number;
  setActiveCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
  handleCarouselWheel: (e: React.WheelEvent) => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({
  onBackToLanding,
  onProjectSelect,
  activeCarouselIndex,
  setActiveCarouselIndex,
  handleCarouselWheel
}) => {
  // Animejs hook for Selection Screen staggered entrance
  useEffect(() => {
    anime({
      targets: '.selection-header-element',
      opacity: [0, 1],
      translateY: [-20, 0],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 500
    });

    anime({
      targets: '.selection-indicator-element',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 350,
      easing: 'easeOutQuad',
      duration: 500
    });
  }, []);

  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-y-auto"
      style={{ backgroundColor: 'var(--theme-primary-bg, #0a1220)', WebkitOverflowScrolling: 'touch' }}
    >
      <CursorGlow />
      
      {/* Full-Screen Immersive Swipeable Carousel */}
      <div 
        className="absolute inset-0 overflow-hidden select-none bg-black"
        onWheel={handleCarouselWheel}
      >
        {/* Header overlay */}
        <div className="absolute top-0 left-0 w-full z-50 p-5 sm:p-8 lg:p-12 pointer-events-none">
          <div className="max-w-7xl mx-auto w-full flex justify-start items-start selection-header-element">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 px-4 py-2.5 text-white hover:text-[#171796] hover:bg-white transition-all cursor-pointer rounded-full pointer-events-auto backdrop-blur-md bg-white/10 font-sans text-xs font-bold tracking-[0.15em] uppercase border border-white/20 shadow-lg"
              aria-label="Back to landing page"
            >
              <ArrowLeft size={16} />
              BACK TO LANDING PAGE
            </button>
          </div>
        </div>

        {/* Left & Right Chevron Overlay Buttons (Desktop Navigation helper) */}
        <motion.button
          initial={{ opacity: 0, y: '-50%', x: -15 }}
          animate={{ opacity: 1, y: '-50%', x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={() => setActiveCarouselIndex(prev => prev - 1)}
          className="absolute left-4 md:left-8 top-1/2 z-50 p-3.5 border border-[#171796]/20 text-[#171796] bg-white/90 hover:bg-[#171796] hover:text-white hover:border-[#171796] transition-all hover:scale-105 active:scale-95 backdrop-blur-md rounded-full shadow-lg cursor-pointer group pointer-events-auto"
          aria-label="Previous Township"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: '-50%', x: 15 }}
          animate={{ opacity: 1, y: '-50%', x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={() => setActiveCarouselIndex(prev => prev + 1)}
          className="absolute right-4 md:right-8 top-1/2 z-50 p-3.5 border border-[#171796]/20 text-[#171796] bg-white/90 hover:bg-[#171796] hover:text-white hover:border-[#171796] transition-all hover:scale-105 active:scale-95 backdrop-blur-md rounded-full shadow-lg cursor-pointer group pointer-events-auto"
          aria-label="Next Township"
        >
          <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
        </motion.button>

        {/* Full Screen Slides */}
        {(() => {
          const indicesToRender = [activeCarouselIndex - 1, activeCarouselIndex, activeCarouselIndex + 1];
          const getProjectIndex = (index: number) => {
            return ((index % COMMERCIAL_PROJECTS.length) + COMMERCIAL_PROJECTS.length) % COMMERCIAL_PROJECTS.length;
          };
          return indicesToRender.map((index) => {
            const projectIndex = getProjectIndex(index);
            const project = COMMERCIAL_PROJECTS[projectIndex];
            const offset = index - activeCarouselIndex;
            const isCenter = offset === 0;

            return (
              <motion.div
                key={index}
                initial={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  willChange: 'transform',
                  WebkitFontSmoothing: 'antialiased',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                animate={{
                  x: `calc(${offset * 100}vw)`,
                  zIndex: isCenter ? 30 : 10,
                }}
                transition={{
                  type: 'tween',
                  ease: [0.25, 1, 0.5, 1],
                  duration: 0.8,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, info) => {
                  const threshold = window.innerWidth * 0.15; // 15% of screen width to swipe
                  if (info.offset.x < -threshold) {
                    setActiveCarouselIndex(prev => prev + 1);
                  } else if (info.offset.x > threshold) {
                    setActiveCarouselIndex(prev => prev - 1);
                  }
                }}
                className={`overflow-hidden cursor-grab active:cursor-grabbing group`}
              >
                {/* Background Image */}
                <img
                  src={project.carouselImage || project.bgImage}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105"
                  style={{ filter: isCenter ? 'brightness(0.8) contrast(1.1)' : 'brightness(0.4) blur(4px)' }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 pb-28 md:pb-32 flex flex-col lg:flex-row items-start lg:items-end justify-between max-w-7xl mx-auto right-0 gap-6 lg:gap-8 pointer-events-none">
                  
                  <div className="flex-1 max-w-2xl space-y-1 md:space-y-2 w-full">
                    {project.logoImage ? (
                      <img 
                        src={project.logoImage} 
                        alt={project.name} 
                        className={`object-contain object-left ${
                          project.id === 'city-di-mare' 
                            ? 'h-16 md:h-28 w-auto' 
                            : project.id === 'brentville-front' 
                              ? 'h-auto w-64 md:w-80 lg:w-[450px] drop-shadow-[0_0_15px_rgba(255,255,255,1)]' 
                              : project.id === 'filinvest-city' 
                                ? 'h-auto w-64 md:w-80 lg:w-[450px]' 
                                : 'h-16 md:h-20 w-auto'
                        }`} 
                      />
                    ) : (
                      <h2 className="text-3xl md:text-6xl font-medium text-[#171796] tracking-wide leading-tight drop-shadow-sm selection-slide-heading" style={{ fontFamily: '"DIN", "DIN Alternate", "DIN Condensed", sans-serif' }}>
                        {project.name}
                      </h2>
                    )}

                    <div className="flex flex-col items-start gap-2 md:gap-3 pt-1 md:pt-2 uppercase font-sans">
                      <span className="bg-[#171796] text-white text-[9px] md:text-[11px] uppercase font-bold tracking-[0.25em] px-3 md:px-3.5 py-1.5 md:py-2 shadow-md flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                        <MapPin size={12} /> {project.location}
                      </span>
                      <div className="shrink-0 bg-white/80 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded shadow-sm sm:shadow-none backdrop-blur-sm sm:backdrop-blur-none mt-1">
                        <span className="block text-[9px] md:text-[11px] font-semibold tracking-widest text-slate-500 whitespace-nowrap">Avg Lot Sizing</span>
                        <span className="block text-sm md:text-lg font-bold text-[#171796] mt-0.5 md:mt-1 whitespace-nowrap">{project.averageLotSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pointer-events-auto w-full md:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectSelect(project);
                      }}
                      className="w-full md:w-auto px-10 py-5 text-sm uppercase font-extrabold tracking-[0.25em] bg-[#171796] text-white hover:bg-blue-800 hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 pointer-events-auto"
                    >
                      Explore Township
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          });
        })()}

        {/* Segmented Bottom Active Page Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="selection-indicator-element absolute bottom-8 left-0 w-full flex flex-col items-center gap-3 z-40 select-none pointer-events-none"
        >
          <div className="flex items-center gap-3 pointer-events-auto">
            {COMMERCIAL_PROJECTS.map((project, idx) => {
              const getProjectIndex = (index: number) => {
                return ((index % COMMERCIAL_PROJECTS.length) + COMMERCIAL_PROJECTS.length) % COMMERCIAL_PROJECTS.length;
              };
              const activeIdx = getProjectIndex(activeCarouselIndex);
              const isActive = idx === activeIdx;
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    const diff = idx - activeIdx;
                    if (diff !== 0) {
                      setActiveCarouselIndex(prev => prev + diff);
                    }
                  }}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer shadow-sm ${
                    isActive ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
          
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 font-sans flex items-center gap-2 drop-shadow-md">
            {(() => {
              const getProjectIndex = (index: number) => {
                return ((index % COMMERCIAL_PROJECTS.length) + COMMERCIAL_PROJECTS.length) % COMMERCIAL_PROJECTS.length;
              };
              return (
                <>
                  <span className="text-white">Township {String(getProjectIndex(activeCarouselIndex) + 1).padStart(2, '0')}</span>
                  <span className="text-white/40">/</span>
                  <span>{String(COMMERCIAL_PROJECTS.length).padStart(2, '0')}</span>
                </>
              );
            })()}
          </div>

          <div className="text-[9px] uppercase tracking-[0.25em] font-medium text-white/40 font-sans flex items-center gap-2 mt-1 drop-shadow-md select-none animate-pulse">
            <span>← Swipe or Drag to Explore Townships →</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SelectionScreen;
