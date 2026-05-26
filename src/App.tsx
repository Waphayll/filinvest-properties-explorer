import React, { useState, useEffect, useMemo, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  MapPin,
  Layers,
  PhilippinePeso,
  Maximize2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Briefcase,
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { CommercialProject, CommercialLot, InvestorLead } from './types';
import { COMMERCIAL_PROJECTS, COMMERCIAL_LOTS, BRAND_COLORS_COMMERCIAL } from './constants';
import InteractiveSDP from './components/InteractiveSDP';
import { Chatbot } from './components/Chatbot';
import { QRCodeSVG } from 'qrcode.react';
import ThemeEditor, { SiteTheme, DEFAULT_THEME, loadThemeFromStorage, applyThemeToDOM } from './components/ThemeEditor';

const CursorGlow = () => {
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const dots = useRef<{ x: number; y: number }[]>(Array.from({ length: 25 }, () => ({ x: 0, y: 0 })));
  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const glowPos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const isHolding = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let isActive = false;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      mouse.current.x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      mouse.current.y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (!isActive) {
        dots.current.forEach(dot => {
          dot.x = mouse.current.x;
          dot.y = mouse.current.y;
        });
        glowPos.current = { x: mouse.current.x, y: mouse.current.y };
        isActive = true;
      }
    };

    const handleMouseDown = () => {
      isHolding.current = true;
      if (trailRef.current) {
        trailRef.current.style.opacity = '1';
      }
    };

    const handleMouseUp = () => {
      isHolding.current = false;
      if (trailRef.current) {
        trailRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchend', handleMouseUp, { passive: true });
    window.addEventListener('touchcancel', handleMouseUp, { passive: true });

    const animate = () => {
      if (!isActive) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // 1. Update slow glow
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.05;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }

      // 2. Update Trail
      let x = mouse.current.x;
      let y = mouse.current.y;

      dots.current.forEach((dot, index) => {
        dot.x += (x - dot.x) * 0.35;
        dot.y += (y - dot.y) * 0.35;

        const el = trailRef.current?.children[index] as HTMLElement;
        if (el) {
          const scale = 1 - (index / 25);
          el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
        }
        x = dot.x;
        y = dot.y;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep, slow-moving ambient glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full mix-blend-screen opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          willChange: 'transform'
        }}
      />

      {/* High-fidelity Gold dust trail */}
      <div 
        ref={trailRef} 
        className="absolute inset-0 mix-blend-screen opacity-0 transition-opacity duration-300"
      >
        {dots.current.map((_, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 rounded-full"
            style={{
              width: '16px',
              height: '16px',
              marginLeft: '-8px',
              marginTop: '-8px',
              background: `rgba(212, 175, 55, ${0.8 * Math.pow(1 - index / 25, 2)})`,
              boxShadow: `0 0 ${10 + index}px rgba(212, 175, 55, ${0.4 * (1 - index / 25)})`,
              willChange: 'transform'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  // --- APPLICATION STATES ---
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'selection' | 'viewer'>('landing');
  const [selectedProject, setSelectedProject] = useState<CommercialProject | null>(null);
  const [selectedLot, setSelectedLot] = useState<CommercialLot | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
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
  const [wipeColor, setWipeColor] = useState<string>('#D4AF37');
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

  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // --- THEME EDITOR STATE ---
  const [siteTheme, setSiteTheme] = useState<SiteTheme>(() => loadThemeFromStorage());

  // Apply theme on mount and whenever it changes
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

  // --- LEAD CAPTURE FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    broker: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- VIEWER GESTURE NAVIGATION ---
  useEffect(() => {
    if (currentScreen !== 'viewer') return;

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
          const wipeColors = ['#171796', '#06b29c', '#df3703', '#fdb10c'];
          setWipeColor(wipeColors[Math.floor(Math.random() * wipeColors.length)]);
          setWipeDirection('backward');
          setIsWiping(true);
          isWipingRef.current = true;
          setTimeout(() => {
            setCurrentScreen('selection');
            setTimeout(() => {
              setIsWiping(false);
              isWipingRef.current = false;
            }, 100);
          }, 600);
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

      if (e.changedTouches.length !== 1) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Edge swipe is more lenient
      const isEdgeSwipe = touchStartX < 100;
      
      // Detect strong rightward swipe (scroll back gesture)
      if (deltaX > (isEdgeSwipe ? 50 : 120) && Math.abs(deltaY) < 60) {
        triggerBackNavigation();
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
  }, [currentScreen]);

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

  // Animejs hook for Landing Screen staggered entrance
  useEffect(() => {
    if (currentScreen === 'landing') {
      anime({
        targets: '.landing-element',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(150),
        easing: 'easeOutExpo',
        duration: 900
      });
    }
  }, [currentScreen]);

  // Animejs hook for Selection Screen staggered entrance
  useEffect(() => {
    if (currentScreen === 'selection') {
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
    }
  }, [currentScreen]);



  // Filter lots of active selected project
  const activeProjectLots = useMemo(() => {
    if (!selectedProject) return [];
    return COMMERCIAL_LOTS.filter(l => l.projectId === selectedProject.id);
  }, [selectedProject]);

  const handleProjectSelect = (project: CommercialProject) => {
    setSelectedProject(project);
    // Pick a random color from the provided palette for the horizontal wipe
    const wipeColors = ['#171796', '#06b29c', '#df3703', '#fdb10c'];
    setWipeColor(wipeColors[Math.floor(Math.random() * wipeColors.length)]);
    setWipeDirection('forward');
    setIsWiping(true);
    isWipingRef.current = true;
    
    // Halfway through the wipe (when screen is covered), change screen state
    setTimeout(() => {
      setSelectedLot(null);
      setCurrentScreen('viewer');
      
      // Let the exit wipe animation play
      setTimeout(() => {
        setIsWiping(false);
        isWipingRef.current = false;
      }, 100); // Trigger exit slightly after the screen swap
    }, 600); // Increased to 600ms for smoother pacing
  };

  const handleLotClick = (lot: CommercialLot) => {
    setSelectedLot(prev => prev?.id === lot.id ? null : lot);
  };

  const handleLotDeselect = () => {
    setSelectedLot(null);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid telephone or mobile number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Create investor lead model
    const newLead: InvestorLead = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: formData.name.trim(),
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim(),
      brokerName: formData.broker.trim() || undefined,
      timestamp: new Date().toISOString(),
      selectedProjectName: selectedProject ? selectedProject.name : 'General Selection',
      selectedLotNumber: selectedLot ? `${selectedLot.blockNumber} - ${selectedLot.lotNumber}` : 'General Inquiry'
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('filinvest_commercial_lot_leads', JSON.stringify(updated));

    setFormSubmitted(true);

    // Smooth timer matching user design to auto close
    setTimeout(() => {
      setShowInquiryModal(false);
      setFormSubmitted(false);
      setFormData({ name: '', contactNumber: '', email: '', broker: '' });
      setErrors({});
    }, 2500);
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
            initial={{ x: wipeDirection === 'forward' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: wipeDirection === 'forward' ? '100%' : '-100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            style={{ backgroundColor: wipeColor }}
          />
        )}
      </AnimatePresence>

      {/* Universal Embedded Content Frame */}
      <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">

          {/* ========================================================
              SCREEN 1: LANDING SCREEN WITH EDITORIAL TOUCH
              ======================================================== */}
          {currentScreen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-12 text-center cursor-pointer overflow-hidden z-0 bg-white"
              onClick={() => setCurrentScreen('selection')}
            >
              <CursorGlow />
              
              {/* Immersive Atmospheric Background Image Backdrop */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                  src="/filinvest_city.png"
                  alt="Filinvest City backdrop"
                  className="w-full h-full object-cover opacity-20 filter grayscale saturate-0 scale-102 blur-[1px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(#17179615_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />

              <div className="pt-12 landing-element opacity-0 z-10">
                <div className="text-[#171796] uppercase tracking-[0.45em] text-2xl font-bold mb-3 font-sans">
                  Filinvest Townships
                </div>
                <h2 className="text-base tracking-[0.5em] text-slate-500 uppercase font-bold">
                  Commercial Portfolio
                </h2>
              </div>

              <div className="space-y-6 max-w-3xl px-6 z-10 landing-element opacity-0">
                <h1 className="text-4xl sm:text-7xl font-display font-medium tracking-tight text-[#171796] leading-tight mt-4">
                  Q2 Investors <span className="font-bold font-display">Night</span>
                </h1>
                <div className="h-[1px] w-24 bg-[#171796]/30 mx-auto my-6"></div>
                <p className="text-base sm:text-lg text-slate-600 font-sans font-light max-w-2xl mx-auto leading-relaxed px-4">
                  Step into the future of urban development with Filinvest Townships. Navigate through our interactive digital blueprints and select a project to explore premium commercial spaces available for development.
                </p>
              </div>

              <div className="pb-12 z-10 landing-element opacity-0">
                <button className="px-10 py-4.5 bg-[#171796] hover:bg-blue-800 shadow-lg shadow-[#171796]/20 border-none text-white rounded-none font-medium tracking-widest uppercase text-xs transition-colors animate-pulse cursor-pointer">
                  Tap Anywhere to Begin
                </button>
              </div>

              {/* QR Code - Desktop only, far bottom-right */}
              <div className="hidden md:flex flex-col items-center gap-2 pointer-events-none absolute bottom-6 right-8 z-20 landing-element opacity-0">
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
          )}

          {/* ========================================================
              SCREEN 2: PROJECT SELECTION SCREEN
              ======================================================== */}
          {currentScreen === 'selection' && (
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
                  <div className="max-w-7xl mx-auto w-full flex justify-between items-start selection-header-element opacity-0">
                    <div>
                      <span className="text-[#D4AF37] tracking-[0.35em] text-xs font-bold uppercase block font-sans drop-shadow-md">
                        Filinvest Townships
                      </span>
                      <h1 className="text-2xl md:text-3xl font-display font-medium text-white mt-1 drop-shadow-lg">
                        Explore Commercial Portfolios
                      </h1>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('landing')}
                      className="flex items-center justify-center p-2 text-slate-200 hover:text-[#D4AF37] hover:scale-110 active:scale-95 transition-all cursor-pointer rounded-full hover:bg-white/10 pointer-events-auto backdrop-blur-sm bg-black/20"
                      aria-label="Back to landing"
                    >
                      <ArrowLeft size={24} />
                    </button>
                  </div>
                </div>

                {/* Left & Right Chevron Overlay Buttons (Desktop Navigation helper) */}
                <button
                  onClick={() => setActiveCarouselIndex(prev => prev - 1)}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3.5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-950 transition-all hover:scale-105 active:scale-95 bg-black/40 backdrop-blur-md rounded-full shadow-lg cursor-pointer group animate-fade-in selection-indicator-element opacity-0"
                  aria-label="Previous Township"
                >
                  <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveCarouselIndex(prev => prev + 1)}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3.5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-950 transition-all hover:scale-105 active:scale-95 bg-black/40 backdrop-blur-md rounded-full shadow-lg cursor-pointer group animate-fade-in selection-indicator-element opacity-0"
                  aria-label="Next Township"
                >
                  <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

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
                          src={project.bgImage}
                          alt={project.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105"
                          style={{ filter: isCenter ? 'brightness(0.8) contrast(1.1)' : 'brightness(0.4) blur(4px)' }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 pb-24 md:pb-32 flex flex-col md:flex-row items-start md:items-end justify-between max-w-7xl mx-auto right-0 gap-8 pointer-events-none">
                          
                          <div className="flex-1 max-w-2xl space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-[#171796] text-white text-[10px] uppercase font-bold tracking-[0.25em] px-3 py-1 shadow-md">
                                {project.brand}
                              </span>
                              <span className="text-xs font-bold tracking-[0.2em] text-[#171796] uppercase flex items-center gap-1.5 font-sans drop-shadow-sm">
                                <MapPin size={12} className="text-[#171796]" /> {project.location.split(',')[0]}
                              </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-display font-medium text-[#171796] tracking-wide leading-tight drop-shadow-sm">
                              {project.name}
                            </h2>

                            <div className="flex gap-8 pt-4 uppercase font-sans">
                              <div>
                                <span className="block text-[9px] md:text-[10px] font-semibold tracking-widest text-slate-500">Avg Lot Sizing</span>
                                <span className="block text-sm md:text-base font-bold text-[#171796] mt-1">{project.averageLotSize}</span>
                              </div>
                              <div>
                                <span className="block text-[9px] md:text-[10px] font-semibold tracking-widest text-slate-500">Est. Market Rates</span>
                                <span className="block text-sm md:text-base font-bold text-[#171796] mt-1">{project.averagePriceRange.split(' ')[0]} / sqm</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 pointer-events-auto w-full md:w-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectSelect(project);
                              }}
                              className="w-full md:w-auto px-8 py-4 text-xs uppercase font-bold tracking-[0.2em] bg-[#171796] text-white hover:bg-blue-800 hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 pointer-events-auto"
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
                <div className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-3 z-40 select-none pointer-events-none selection-indicator-element opacity-0">
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
                            isActive ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/40 hover:bg-white/70'
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
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCREEN 3: PROJECT OVERVIEW & INTERACTIVE MAP VIEW
              ======================================================== */}
          {currentScreen === 'viewer' && selectedProject && (
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
                  <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black">
                    <img 
                      src={selectedProject.bgImage} 
                      alt={selectedProject.name} 
                      className="w-full h-full object-cover opacity-80" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220]/90 via-[#0a1220]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0a1220]/50 md:to-[#0a1220]" />
                  </div>

                  {/* Right Side: Description */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
                    <span className="text-[#171796] tracking-[0.3em] text-xs font-bold uppercase block font-sans mb-4">
                      {selectedProject.brand}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-[#171796] mb-6">
                      {selectedProject.name}
                    </h2>
                    <div className="h-[1px] w-16 bg-[#171796]/30 mb-8"></div>
                    <p className="text-slate-600 font-sans font-light leading-relaxed mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <p className="text-slate-600 font-sans font-light leading-relaxed mb-12">
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
                    </p>
                    
                    <button 
                      onClick={(e) => {
                        const container = e.currentTarget.closest('.snap-mandatory');
                        if (container) {
                          container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-3 text-[#171796] text-xs font-bold tracking-[0.2em] uppercase hover:text-blue-800 transition-colors w-max group"
                    >
                      <span className="border border-[#171796]/30 p-3 rounded-full group-hover:bg-[#171796]/10 transition-colors">
                        <ArrowLeft size={16} className="rotate-180" />
                      </span>
                      Scroll To Map
                    </button>
                  </div>
                </div>

                {/* Panel 2: Interactive Map */}
                <div className="w-full shrink-0 snap-center snap-always flex flex-col relative h-full bg-white">

                  {/* Top Persistent Navigation Header */}
                  <header className="border-b border-[#171796]/10 backdrop-blur px-4 sm:px-10 z-10 shrink-0 relative
                    flex flex-col gap-3 py-3
                    md:grid md:grid-cols-3 md:h-24 md:py-0 md:gap-0 md:items-center bg-white/95 text-[#171796]">
                    {/* Row 1 on mobile: Back + Title + Admin */}
                    <div className="flex items-center gap-3 justify-between md:justify-start">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setCurrentScreen('selection');
                            setSelectedLot(null);
                          }}
                          className="flex items-center justify-center p-2 text-slate-400 hover:text-[#D4AF37] hover:scale-110 active:scale-95 transition-all cursor-pointer rounded-full hover:bg-white/5 shrink-0"
                          aria-label="Back to selection"
                        >
                          <ArrowLeft size={24} />
                        </button>
                        <div className="min-w-0">
                          <h2 className="text-base md:text-2xl font-display font-medium text-[#171796] flex items-center gap-2 truncate">
                            <span className="truncate">{selectedProject.name}</span>
                            {selectedProject.id === 'filinvest-city' && (
                              <span 
                                onClick={() => {
                                  setAlabangClicks(prev => {
                                    const next = prev + 1;
                                    if (next >= 5) {
                                      handleAdminToggle();
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
                            {selectedProject.location} • {selectedProject.brand}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Switch Tabs Removed */}

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
                          <ThemeEditor theme={siteTheme} setTheme={setSiteTheme} />
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
                            onClick={handleAdminToggle}
                            className="mr-4 px-3 py-2 text-[9px] uppercase font-bold tracking-widest transition-all rounded-none border bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)] hover:bg-indigo-500"
                          >
                            Exit Edit Mode
                          </button>
                        </>
                      )}
                      {inquiriesEnabled && (
                        <button
                          onClick={() => {
                            setFormSubmitted(false);
                            setShowInquiryModal(true);
                          }}
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
                      onLotSelect={handleLotClick}
                      onLotDeselect={handleLotDeselect}
                      onDlsuClick={handleDlsuClick}
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
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#171796] block mb-1.5 font-sans">
                          Lot Specification
                        </span>
                        <h3 className="font-display text-2.5xl font-medium tracking-wide italic text-[#171796]">
                          Lot Registry
                        </h3>
                      </div>

                      {/* Content Scroll Area */}
                      <div className="flex-1 flex flex-col justify-start py-2 font-sans text-sm gap-4">
                        
                        {/* CAD / Architectural Design Image Placeholder */}
                        <div className="lot-detail-item opacity-0 pb-4 border-b border-[#171796]/10 mb-2">
                          <div className="w-full h-48 bg-slate-50 border border-[#171796]/10 flex flex-col items-center justify-center relative overflow-hidden text-slate-400 hover:text-slate-500 transition-colors cursor-crosshair">
                            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                              CAD / Architectural Plan
                            </span>
                            <span className="text-[8px] font-sans mt-1 opacity-50 uppercase tracking-wider">
                              (Image Placeholder)
                            </span>
                          </div>
                        </div>

                        {/* Architectural Ledger List */}
                        <div className="space-y-3 font-sans">
                          
                          <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              Lot Identifier
                            </span>
                            <span className="text-sm font-semibold text-[#171796]">
                              Block {selectedLot.blockNumber} • Lot {selectedLot.lotNumber}
                            </span>
                          </div>

                          <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              Lot Area
                            </span>
                            <span className="text-sm font-semibold text-[#171796]">
                              {selectedLot.areaSqm.toLocaleString()} sqm
                            </span>
                          </div>

                          <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              FAR Limit
                            </span>
                            <span className="text-sm font-semibold text-[#171796]">
                              FAR {selectedLot.far}.0
                            </span>
                          </div>

                          <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              Price per SQM
                            </span>
                            <span className="text-sm font-semibold text-[#171796]">
                              ₱ {selectedLot.pricePerSqm.toLocaleString()} / sqm
                            </span>
                          </div>

                          {selectedLot.structureSize !== undefined && selectedLot.structurePrice !== undefined && (
                            <>
                              <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                  Structure Size
                                </span>
                                <span className="text-sm font-semibold text-[#171796]">
                                  {selectedLot.structureSize.toLocaleString()} sqm
                                </span>
                              </div>
                              <div className="lot-detail-item opacity-0 flex justify-between items-baseline py-2.5 border-b border-[#171796]/10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                  Structure Price
                                </span>
                                <span className="text-sm font-semibold text-[#171796]">
                                  ₱ {selectedLot.structurePrice.toLocaleString()}
                                </span>
                              </div>
                            </>
                          )}
                          
                          {/* Total Contract Value Ledger Box */}
                          <div className="lot-detail-item opacity-0 mt-6 py-4.5 px-5 bg-[#171796]/[0.02] border-y-4 border-double border-[#171796]/30 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#171796] font-sans">
                              Contract Value (TCP)
                            </span>
                            <span className="text-2xl font-display font-bold text-[#171796]">
                              ₱ {((selectedLot.areaSqm * selectedLot.pricePerSqm) + (selectedLot.structurePrice || 0)).toLocaleString()}
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      {inquiriesEnabled && (
                        <button
                          onClick={() => {
                            setFormSubmitted(false);
                            setShowInquiryModal(true);
                          }}
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
          )}

        </AnimatePresence>
      </div>

      {/* ========================================================
          SCREEN 7: LEAD CAPTURE POPUP OVERLAY MODAL (REFINED DESIGN)
          ======================================================== */}
      <AnimatePresence>
        {showInquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a1220]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="bg-[#111c2e] border border-white/10 w-full max-w-lg rounded-none overflow-hidden shadow-2xl relative"
            >

              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">
                    Filinvest Townships
                  </h4>
                  <h3 className="text-xl font-display font-semibold text-white mt-1">
                    Investment Inquiry Form
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                    Catalog your priority registry profile
                  </p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="p-1.5 bg-[#0a1220] border border-white/10 hover:text-[#D4AF37] transition-all text-slate-400"
                >
                  <X size={15} />
                </button>
              </div>

              {formSubmitted ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                  <CheckCircle2 size={44} className="text-emerald-400" />
                  <h4 className="text-xl font-display font-medium text-white">Inquiry Documented</h4>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-sans">
                    Registry files logged safely. Our township account executive will prioritize your follow-up profile.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-sans">

                  {selectedLot && (
                    <div className="bg-[#0a1220] p-3 rounded-none border border-white/5 text-[10px] uppercase font-bold tracking-widest flex justify-between items-center mb-1">
                      <span className="text-slate-400">Attached Parameter:</span>
                      <span className="font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 border border-[#D4AF37]/25">
                        {selectedProject?.name.substring(0, 15)} - {selectedLot.lotNumber}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-slate-300 flex items-center gap-1.5">
                      <User size={12} className="text-slate-500" /> Investor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Attendee Name"
                      className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                    {errors.name && <p className="text-[10px] text-rose-400 font-semibold mt-0.5">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-500" /> Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="+63 900 000 0000"
                      className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                    {errors.contactNumber && <p className="text-[10px] text-rose-400 font-semibold mt-0.5">{errors.contactNumber}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-500" /> Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="investor@example.com"
                      className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                    {errors.email && <p className="text-[10px] text-rose-400 font-semibold mt-0.5">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-slate-600" /> Accredited Broker <span className="text-[8px] text-slate-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.broker}
                      onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                      placeholder="Broker Name / Agency"
                      className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="pt-4 flex gap-3 text-xs uppercase tracking-wider font-bold">
                    <button
                      type="button"
                      onClick={() => setShowInquiryModal(false)}
                      className="flex-1 py-3 bg-[#0a1220] border border-white/10 hover:bg-white/5 text-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-all shadow"
                    >
                      Submit Sheet
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium AI Chatbot Concierge Widget */}
      {chatbotEnabled && (
        <Chatbot 
          projects={COMMERCIAL_PROJECTS} 
          lots={COMMERCIAL_LOTS} 
          onOpenInquiry={() => setShowInquiryModal(true)} 
        />
      )}

      {/* Easter Egg loading screen */}
      {showEasterEggLoading && (
        <div className="fixed inset-0 bg-[#0a1220] z-[9999] flex flex-col items-center justify-center text-center p-6">
          <div className="space-y-6 max-w-md">
            <div className="text-[#D4AF37] uppercase tracking-[0.45em] text-[10px] font-bold font-sans animate-pulse">
              Interactive Properties Explorer
            </div>
            
            <h1 className="text-3xl font-display font-medium text-white leading-tight">
              This was made by <span className="font-bold text-[#D4AF37] block mt-1 tracking-wider">Waphayll</span>
            </h1>
            
            <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
            
            <div className="flex flex-col items-center gap-3">
              {/* Spinner */}
              <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <p className="text-slate-400 text-[10px] tracking-widest uppercase animate-pulse">
                Redirecting to Portfolio...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
