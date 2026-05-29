import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import anime from 'animejs/lib/anime.es.js';

import { CommercialProject, CommercialLot, InvestorLead } from './types';
import { COMMERCIAL_PROJECTS, COMMERCIAL_LOTS } from './constants';
import { Chatbot } from './components/Chatbot';
import { SiteTheme, loadThemeFromStorage, applyThemeToDOM } from './components/ThemeEditor';

// Hooks
import { useInactivityTimeout } from './hooks/useInactivityTimeout';

// Screens & Components
import LoadingScreen from './screens/LoadingScreen';
import LandingScreen from './screens/LandingScreen';
import SelectionScreen from './screens/SelectionScreen';
import ViewerScreen from './screens/ViewerScreen';
import InquiryModal from './components/InquiryModal';
import EasterEggLoading from './components/EasterEggLoading';

export default function App() {
  // --- APPLICATION STATES ---
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'landing' | 'selection' | 'viewer'>('loading');
  const [selectedProject, setSelectedProject] = useState<CommercialProject | null>(null);
  const [selectedLot, setSelectedLot] = useState<CommercialLot | null>(null);
  
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [leads, setLeads] = useState<InvestorLead[]>([]);
  
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [inquiriesEnabled, setInquiriesEnabled] = useState<boolean>(false);
  const [chatbotEnabled, setChatbotEnabled] = useState<boolean>(false);
  const [easterEggEnabled, setEasterEggEnabled] = useState<boolean>(true);
  const [alabangClicks, setAlabangClicks] = useState<number>(0);
  
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  
  // --- TRANSITION STATE ---
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const isWipingRef = useRef<boolean>(false);
  const [wipeColor, setWipeColor] = useState<string>('#171796');
  const [wipeDirection, setWipeDirection] = useState<'forward' | 'backward'>('forward');

  // --- CAROUSEL WHEEL SCROLL STATE ---
  const lastWheelTime = useRef<number>(0);

  const handleCarouselWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return; // 400ms debounce

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 20) {
        setActiveCarouselIndex(prev => prev + 1);
        lastWheelTime.current = now;
      } else if (e.deltaX < -20) {
        setActiveCarouselIndex(prev => prev - 1);
        lastWheelTime.current = now;
      }
    } else {
      if (e.deltaY > 20) {
        setActiveCarouselIndex(prev => prev + 1);
        lastWheelTime.current = now;
      } else if (e.deltaY < -20) {
        setActiveCarouselIndex(prev => prev - 1);
        lastWheelTime.current = now;
      }
    }
  };

  // --- INACTIVITY TIMEOUT ---
  const handleInactivityTimeout = () => {
    if (currentScreen !== 'landing' && currentScreen !== 'loading') {
      setCurrentScreen('landing');
      setSelectedProject(null);
      setSelectedLot(null);
      setShowInquiryModal(false);
      setActiveCarouselIndex(0);
    }
  };
  useInactivityTimeout(true, handleInactivityTimeout);

  // --- THEME EDITOR STATE ---
  const [siteTheme] = useState<SiteTheme>(() => loadThemeFromStorage());
  useEffect(() => {
    applyThemeToDOM(siteTheme);
  }, [siteTheme]);

  // --- EASTER EGG STATES ---
  const [dlsuClicks, setDlsuClicks] = useState<number>(0);
  const [showEasterEggLoading, setShowEasterEggLoading] = useState<boolean>(false);

  const handleDlsuClick = () => {
    setDlsuClicks(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setShowEasterEggLoading(true);
        setTimeout(() => {
          window.location.href = "https://waphayll.github.io/Portfolio/";
        }, 3500);
        return 0;
      }
      return next;
    });
  };

  // Sync leads from LocalStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('filinvest_commercial_lot_leads');
      if (cached) {
        setLeads(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to parse cached leads:", e);
    }
  }, []);

  // Animejs hook for lot selection
  useEffect(() => {
    if (currentScreen === 'viewer' && selectedLot) {
      anime({
        targets: '.lot-detail-item',
        opacity: [0, 1],
        translateX: [40, 0],
        scale: [0.95, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 800
      });
    }
  }, [selectedLot, currentScreen]);

  // Filter lots of active selected project
  const activeProjectLots = useMemo(() => {
    if (!selectedProject) return [];
    return COMMERCIAL_LOTS.filter(l => l.projectId === selectedProject.id);
  }, [selectedProject]);

  const triggerTransition = (color: string, direction: 'forward' | 'backward', onHalfway: () => void) => {
    if (isWipingRef.current) return;
    setWipeColor(color);
    setWipeDirection(direction);
    setIsWiping(true);
    isWipingRef.current = true;
    
    setTimeout(() => {
      onHalfway();
      setTimeout(() => {
        setIsWiping(false);
        isWipingRef.current = false;
      }, 100);
    }, 600);
  };

  const getRandomWipeColor = () => {
    const wipeColors = ['#171796', '#06b29c', '#df3703', '#fdb10c'];
    return wipeColors[Math.floor(Math.random() * wipeColors.length)];
  };

  const handleProjectSelect = (project: CommercialProject) => {
    setSelectedProject(project);
    triggerTransition(getRandomWipeColor(), 'forward', () => {
      setSelectedLot(null);
      setCurrentScreen('viewer');
    });
  };

  const handleBackToSelection = () => {
    triggerTransition(getRandomWipeColor(), 'backward', () => {
      setSelectedLot(null);
      setCurrentScreen('selection');
    });
  };

  const handleBackToLanding = () => {
    triggerTransition(getRandomWipeColor(), 'backward', () => {
      setSelectedProject(null);
      setSelectedLot(null);
      setCurrentScreen('landing');
    });
  };

  const handleLotClick = (lot: CommercialLot) => {
    setSelectedLot(prev => prev?.id === lot.id ? null : lot);
  };

  const handleAdminToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      const pwd = window.prompt("Enter Admin Password:");
      if (pwd === "Admin123") {
        setIsEditMode(true);
      } else if (pwd !== null) {
        alert("Incorrect password");
      }
    }
  };

  const handleLeadSubmit = (newLead: InvestorLead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('filinvest_commercial_lot_leads', JSON.stringify(updated));
  };

  return (
    <div
      className="w-full h-[100dvh] text-slate-100 font-sans select-none overflow-hidden relative flex flex-col"
      style={{ backgroundColor: 'var(--theme-primary-bg, #0a1220)', color: 'var(--theme-text-primary, #f1f5f9)' }}
    >
      {/* Global Color Wipe Overlay */}
      <AnimatePresence>
        {isWiping && (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none"
            initial={{ x: wipeDirection === 'forward' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: wipeDirection === 'forward' ? '-100%' : '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            style={{ backgroundColor: wipeColor }}
          />
        )}
      </AnimatePresence>

      {/* Universal Embedded Content Frame */}
      <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {currentScreen === 'loading' && (
            <LoadingScreen onLoaded={() => setCurrentScreen('landing')} />
          )}

          {currentScreen === 'landing' && (
            <LandingScreen onStart={() => setCurrentScreen('selection')} />
          )}

          {currentScreen === 'selection' && (
            <SelectionScreen
              onBackToLanding={handleBackToLanding}
              onProjectSelect={handleProjectSelect}
              activeCarouselIndex={activeCarouselIndex}
              setActiveCarouselIndex={setActiveCarouselIndex}
              handleCarouselWheel={handleCarouselWheel}
            />
          )}

          {currentScreen === 'viewer' && selectedProject && (
            <ViewerScreen
              selectedProject={selectedProject}
              activeProjectLots={activeProjectLots}
              selectedLot={selectedLot}
              onLotClick={handleLotClick}
              onLotDeselect={() => setSelectedLot(null)}
              onDlsuClick={handleDlsuClick}
              isEditMode={isEditMode}
              easterEggEnabled={easterEggEnabled}
              chatbotEnabled={chatbotEnabled}
              setChatbotEnabled={setChatbotEnabled}
              setEasterEggEnabled={setEasterEggEnabled}
              inquiriesEnabled={inquiriesEnabled}
              setInquiriesEnabled={setInquiriesEnabled}
              onAdminToggle={handleAdminToggle}
              onShowInquiryModal={() => setShowInquiryModal(true)}
              onBackToSelection={handleBackToSelection}
              setAlabangClicks={setAlabangClicks}
              isWipingRef={isWipingRef}
            />
          )}
        </AnimatePresence>
      </div>

      <InquiryModal
        showModal={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        selectedProject={selectedProject}
        selectedLot={selectedLot}
        onLeadSubmit={handleLeadSubmit}
      />

      {chatbotEnabled && (
        <Chatbot 
          projects={COMMERCIAL_PROJECTS} 
          lots={COMMERCIAL_LOTS} 
          onOpenInquiry={() => setShowInquiryModal(true)} 
        />
      )}

      {showEasterEggLoading && <EasterEggLoading />}

      {/* Invisible DOM Preloading Container to prevent GPU decode delays */}
      <div className="fixed top-[-10000px] left-[-10000px] opacity-0 pointer-events-none w-[1px] h-[1px] overflow-hidden z-[-1]">
        <img src="/landing.svg" alt="" />
        <img src="/lasalle.jpg" alt="" />
        {COMMERCIAL_PROJECTS.map(p => (
          <React.Fragment key={p.id}>
            {p.carouselImage && <img src={p.carouselImage} alt="" />}
            {p.bgImage && <img src={p.bgImage} alt="" />}
            {p.logoImage && <img src={p.logoImage} alt="" />}
            {p.conceptMapSvg && <img src={`/${p.conceptMapSvg}`} alt="" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
