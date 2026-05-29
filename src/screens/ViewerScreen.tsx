import React, { MutableRefObject } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { CommercialProject, CommercialLot } from '../types';
import InteractiveSDP from '../components/InteractiveSDP';
import { useViewerGestures } from '../hooks/useViewerGestures';

interface ViewerScreenProps {
  selectedProject: CommercialProject;
  activeProjectLots: CommercialLot[];
  selectedLot: CommercialLot | null;
  onLotClick: (lot: CommercialLot) => void;
  onLotDeselect: () => void;
  onDlsuClick: () => void;
  isEditMode: boolean;
  easterEggEnabled: boolean;
  chatbotEnabled: boolean;
  setChatbotEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setEasterEggEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  inquiriesEnabled: boolean;
  setInquiriesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onAdminToggle: () => void;
  onShowInquiryModal: () => void;
  onBackToSelection: () => void;
  setAlabangClicks: React.Dispatch<React.SetStateAction<number>>;
  isWipingRef: MutableRefObject<boolean>;
}

const ViewerScreen: React.FC<ViewerScreenProps> = ({
  selectedProject,
  activeProjectLots,
  selectedLot,
  onLotClick,
  onLotDeselect,
  onDlsuClick,
  isEditMode,
  easterEggEnabled,
  chatbotEnabled,
  setChatbotEnabled,
  setEasterEggEnabled,
  inquiriesEnabled,
  setInquiriesEnabled,
  onAdminToggle,
  onShowInquiryModal,
  onBackToSelection,
  setAlabangClicks,
  isWipingRef
}) => {

  useViewerGestures(true, onBackToSelection, isWipingRef);

  return (
    <motion.div
      key="viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col bg-white"
    >
      {/* Core Interactive Screen Layout - Horizontal Scroll Container */}
      <div id="viewer-scroll-container" className="flex-1 w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide relative" style={{ scrollBehavior: 'smooth' }}>

        {/* Panel 1: Split Screen Project Intro */}
        <div className="w-full shrink-0 snap-center snap-always flex flex-col md:flex-row relative h-full">
          {/* Left Side: Township Image */}
          <div className="w-full md:w-1/2 h-[35vh] md:h-full relative overflow-hidden bg-slate-900">
            <img 
              src={selectedProject.carouselImage || selectedProject.bgImage} 
              alt={selectedProject.name} 
              className="w-full h-full object-cover opacity-95" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/40" />
          </div>

          {/* Right Side: Description */}
          <div className="w-full md:w-1/2 h-[65vh] md:h-full bg-white flex flex-col justify-start md:justify-center p-6 sm:p-10 md:p-16 lg:p-24 overflow-y-auto min-h-0 project-intro-description">
            <span className="text-[#171796] tracking-[0.3em] text-xs font-bold uppercase flex items-center gap-1.5 font-sans mb-2 md:mb-4">
              <MapPin size={12} /> {selectedProject.location}
            </span>
            {selectedProject.logoImage ? (
              <img src={selectedProject.logoImage} alt={selectedProject.name} className={`object-contain object-left mb-4 md:mb-6 ${selectedProject.id === 'city-di-mare' ? 'h-16 md:h-24' : selectedProject.id === 'brentville-front' ? 'h-14 md:h-20 drop-shadow-[0_0_15px_rgba(255,255,255,1)]' : 'h-12 md:h-16'}`} />
            ) : (
              <h2 className="text-3xl md:text-5xl font-medium text-[#171796] mb-4 md:mb-6 project-intro-heading" style={{ fontFamily: '"DIN", "DIN Alternate", "DIN Condensed", sans-serif' }}>
                {selectedProject.name}
              </h2>
            )}
            <div className="h-[1px] w-16 bg-[#171796]/30 mb-4 md:mb-8"></div>
            {selectedProject.fullDescription.map((paragraph, idx) => (
              <p key={idx} className={`text-sm md:text-base text-slate-600 font-sans font-light leading-relaxed ${idx === selectedProject.fullDescription.length - 1 ? 'mb-6 md:mb-12' : 'mb-4 md:mb-6'}`}>
                {paragraph}
              </p>
            ))}
            
          </div>

          {/* Floating Left Swipe-to-Townships Indicator Guides */}
          <div 
            onClick={onBackToSelection}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 py-8 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-lg text-white transition-all rounded-full cursor-pointer animate-pulse pointer-events-auto group"
          >
            <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors animate-bounce-horizontal-left">
              <ArrowLeft size={14} />
            </span>
            <span className="text-[9px] font-bold tracking-[0.32em] uppercase [writing-mode:vertical-lr] select-none text-white transition-colors">
              Swipe to Townships
            </span>
          </div>

          <div 
            onClick={onBackToSelection}
            className="absolute left-4 bottom-4 z-40 md:hidden flex items-center gap-2.5 py-3 px-5 bg-white/90 backdrop-blur border border-[#171796]/15 shadow-md text-[#171796] transition-all rounded-full cursor-pointer animate-pulse pointer-events-auto"
          >
            <ArrowLeft size={12} className="animate-bounce-horizontal-left" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase select-none text-[#171796]/80">
              Townships
            </span>
          </div>

          {/* Floating Right Swipe-to-Map Indicator Guides */}
          <div 
            onClick={(e) => {
              const container = document.getElementById('viewer-scroll-container');
              if (container) {
                container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
              }
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 py-8 px-4 bg-white/30 backdrop-blur-md hover:bg-white/50 border border-[#171796]/10 hover:border-[#171796]/25 shadow-lg text-[#171796] transition-all rounded-full cursor-pointer animate-pulse pointer-events-auto group"
          >
            <span className="text-[9px] font-bold tracking-[0.32em] uppercase [writing-mode:vertical-lr] select-none text-[#171796] transition-colors">
              Swipe to Map
            </span>
            <span className="p-1.5 rounded-full bg-[#171796]/10 group-hover:bg-[#171796]/20 transition-colors animate-bounce-horizontal">
              <ArrowRight size={14} />
            </span>
          </div>

          <div 
            onClick={(e) => {
              const container = document.getElementById('viewer-scroll-container');
              if (container) {
                container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
              }
            }}
            className="absolute right-4 bottom-4 z-40 md:hidden flex items-center gap-2.5 py-3 px-5 bg-white/90 backdrop-blur border border-[#171796]/15 shadow-md text-[#171796] transition-all rounded-full cursor-pointer animate-pulse pointer-events-auto"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase select-none text-[#171796]/80">
              Swipe to Map
            </span>
            <ArrowRight size={12} className="animate-bounce-horizontal" />
          </div>
        </div>

        {/* Panel 2: Interactive Map */}
        <div className="w-full shrink-0 snap-center snap-always flex flex-col relative h-full bg-white">

          <header className="border-b-2 border-[#171796] backdrop-blur px-4 sm:px-10 z-10 shrink-0 relative
            flex flex-col gap-3 py-3
            md:grid md:grid-cols-3 md:h-24 md:py-0 md:gap-0 md:items-center bg-white/95 text-[#171796]">
            {/* Row 1 on mobile: Back + Title + Admin */}
            <div className="flex items-center gap-3 justify-between md:justify-start">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBackToSelection}
                  className="flex items-center justify-center p-2 text-slate-400 hover:text-[#171796] hover:scale-110 active:scale-95 transition-all cursor-pointer rounded-full hover:bg-white/5 shrink-0"
                  aria-label="Back to selection"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="min-w-0">
                  <h2 className="text-base md:text-2xl font-display font-medium text-[#171796] flex items-center gap-2 truncate" style={!selectedProject.logoImage ? { fontFamily: '"DIN", "DIN Alternate", "DIN Condensed", sans-serif' } : {}}>
                    {selectedProject.logoImage ? (
                      <img src={selectedProject.logoImage} alt={selectedProject.name} className={`object-contain object-left ${selectedProject.id === 'city-di-mare' ? 'h-7 md:h-10' : selectedProject.id === 'brentville-front' ? 'h-6 md:h-9 drop-shadow-[0_0_10px_rgba(255,255,255,1)]' : 'h-6 md:h-8'}`} />
                    ) : (
                      <span className="truncate">{selectedProject.name}</span>
                    )}
                    {selectedProject.id === 'filinvest-city' && (
                      <span 
                        onClick={() => {
                          setAlabangClicks((prev: number) => {
                            const next = prev + 1;
                            if (next >= 5) {
                              onAdminToggle();
                              return 0;
                            }
                            return next;
                          });
                        }}
                        className="cursor-pointer text-[9px] md:text-[10px] bg-[#171796]/10 text-[#171796] border border-[#171796]/20 px-1.5 md:px-2.5 py-0.5 uppercase tracking-widest font-bold font-sans shrink-0 pointer-events-auto"
                      >
                        Featured
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest truncate max-w-sm hidden md:block mt-0.5">
                    {selectedProject.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop-only admin controls row */}
            <div className="hidden md:flex items-center justify-self-end">
              {isEditMode && (
                <>
                  <label className="mr-5 flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chatbotEnabled}
                      onChange={(e) => setChatbotEnabled(e.target.checked)}
                      className="accent-amber-500 w-3.5 h-3.5"
                    />
                    Chatbot
                  </label>
                  <label className="mr-5 flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={easterEggEnabled}
                      onChange={(e) => setEasterEggEnabled(e.target.checked)}
                      className="accent-amber-500 w-3.5 h-3.5"
                    />
                    Easter Egg
                  </label>
                  <label className="mr-5 flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inquiriesEnabled}
                      onChange={(e) => setInquiriesEnabled(e.target.checked)}
                      className="accent-indigo-500 w-3.5 h-3.5"
                    />
                    Inquiries
                  </label>

                  <button
                    onClick={() => {
                      setChatbotEnabled(false);
                      setEasterEggEnabled(false);
                    }}
                    className="mr-3 px-3 py-2 text-[9px] uppercase font-bold tracking-widest transition-all rounded-none border bg-rose-600 text-white border-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)] hover:bg-rose-500"
                  >
                    Showcase Mode
                  </button>
                  <button
                    onClick={onAdminToggle}
                    className="mr-4 px-3 py-2 text-[9px] uppercase font-bold tracking-widest transition-all rounded-none border bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)] hover:bg-indigo-500"
                  >
                    Exit Edit Mode
                  </button>
                </>
              )}
              {inquiriesEnabled && (
                <button
                  onClick={onShowInquiryModal}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-white text-slate-950 text-xs uppercase font-bold tracking-widest transition-all rounded-none shadow"
                >
                  Inquire Now
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row kiosk-portrait-container relative min-h-0">

            {/* Interactive Map Area (Fills Center) */}
            <div className="flex-1 bg-slate-950/20 flex flex-col relative overflow-hidden">
            <div className="flex-1 h-full w-full relative">
            <InteractiveSDP
              project={selectedProject}
              lots={activeProjectLots}
              selectedLot={selectedLot}
              onLotSelect={onLotClick}
              onLotDeselect={onLotDeselect}
              onDlsuClick={onDlsuClick}
              isEditMode={isEditMode}
              easterEggEnabled={easterEggEnabled}
            />
          </div>
        </div>

          {/* Right Side Fixed Details Panel Layout (Screen 5 Compliance) */}
          {selectedLot && (
            <div className="w-full md:w-[30rem] border-t md:border-t-0 md:border-l border-[#171796]/10 flex flex-col justify-between p-8 sm:p-10 lg:p-12 shrink-0 h-[60vh] md:h-full z-10 overflow-y-auto kiosk-portrait-sidebar bg-white">
              <div className="flex-1 flex flex-col justify-between min-h-0">
              
              {/* Editorial Double Rule Header */}
              <div className="border-b-4 border-double border-[#171796]/20 pb-5 shrink-0 mb-6">
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-[0.25em] text-[#171796] font-sans">
                  Lot Specification
                </h3>
              </div>

              {/* Content Scroll Area */}
              <div className="flex-1 flex flex-col justify-start py-2 font-sans text-sm gap-4">

                {/* Architectural Ledger List */}
                <div className="space-y-4 md:space-y-6 font-sans">
                  
                  <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-4 md:py-5 border-b border-[#171796]/10">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                      {selectedProject?.id === 'filinvest-city' ? 'District' : 'Block'}
                    </span>
                    <span className="text-base md:text-lg font-bold text-[#171796]">
                      {selectedLot.blockNumber}
                    </span>
                  </div>

                  <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-4 md:py-5 border-b border-[#171796]/10">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                      Lot Identifier
                    </span>
                    <span className="text-base md:text-lg font-bold text-[#171796]">
                      {selectedLot.lotNumber}
                    </span>
                  </div>

                  <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-4 md:py-5 border-b border-[#171796]/10">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                      Lot Area
                    </span>
                    <span className="text-base md:text-lg font-bold text-[#171796]">
                      {selectedLot.areaSqm.toLocaleString()} sqm
                    </span>
                  </div>

                  <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-4 md:py-5 border-b border-[#171796]/10">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                      FAR Limit
                    </span>
                    <span className="text-base md:text-lg font-bold text-[#171796]">
                      FAR {selectedLot.far}.0
                    </span>
                  </div>

                  {selectedLot.structureSize !== undefined && (
                    <>
                      <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-4 md:py-5 border-b border-[#171796]/10">
                        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                          Structure Size
                        </span>
                        <span className="text-base md:text-lg font-bold text-[#171796]">
                          {selectedLot.structureSize.toLocaleString()} sqm
                        </span>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>

            <div className="mt-8">
              {inquiriesEnabled && (
                <button
                  onClick={onShowInquiryModal}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer"
                >
                  Inquire For This Lot
                </button>
              )}
            </div>
            </div>
          )}
          </div>
        </div> {/* End Panel 2 */}
      </div> {/* End Horizontal Scroll Container */}
    </motion.div>
  );
};

export default ViewerScreen;
