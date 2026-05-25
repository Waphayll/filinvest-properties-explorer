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
  FileText
} from 'lucide-react';

import { CommercialProject, CommercialLot, InvestorLead } from './types';
import { COMMERCIAL_PROJECTS, COMMERCIAL_LOTS, BRAND_COLORS_COMMERCIAL } from './constants';
import InteractiveSDP from './components/InteractiveSDP';
import { Chatbot } from './components/Chatbot';
import { QRCodeSVG } from 'qrcode.react';

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

  const handleProjectSelect = (project: CommercialProject) => {
    if (project.id === 'filinvest-city') {
      setAlabangClicks(prev => {
        const next = prev + 1;
        if (next >= 5) {
          handleAdminToggle();
          return 0;
        }
        return next;
      });
    } else {
      setAlabangClicks(0);
    }
    setSelectedProject(project);
    setSelectedLot(null);
    setCurrentScreen('viewer');
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
    <div className="w-full h-[100dvh] bg-[#0a1220] text-slate-100 font-sans select-none overflow-hidden relative flex flex-col">

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
              className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-12 bg-gradient-to-b from-[#111c2e] to-[#0a1220] text-center cursor-pointer overflow-hidden z-0"
              onClick={() => setCurrentScreen('selection')}
            >
              <CursorGlow />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />

              <div className="pt-12">
                <div className="text-[#D4AF37] uppercase tracking-[0.45em] text-2xl font-bold mb-3 font-sans">
                  Filinvest Townships
                </div>
                <h2 className="text-base tracking-[0.5em] text-slate-400 uppercase font-bold">
                  Commercial Portfolio
                </h2>
              </div>

              <div className="space-y-6 max-w-3xl px-6 z-10">

                <h1 className="text-4xl sm:text-7xl font-display font-medium tracking-tight text-white leading-tight mt-4">
                  Q2 Investors <span className="font-bold font-display">Night</span>
                </h1>
                <div className="h-[1px] w-24 bg-[#D4AF37]/40 mx-auto my-6"></div>
                <p className="text-base sm:text-lg text-slate-300 font-sans font-light max-w-2xl mx-auto leading-relaxed px-4">
                  Step into the future of urban development with Filinvest Townships. Navigate through our interactive digital blueprints and select a project to explore premium commercial spaces available for development.
                </p>
              </div>

              <div className="pb-12 z-10">
                <button className="px-10 py-4.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-500/20 text-white rounded-none shadow-xl font-medium tracking-widest uppercase text-xs transition-colors animate-pulse">
                  Tap Anywhere to Begin
                </button>
              </div>

              {/* QR Code - Desktop only, far bottom-right */}
              <div className="hidden md:flex flex-col items-center gap-2 pointer-events-none absolute bottom-6 right-8 z-20">
                <div className="bg-[#111c2e] p-2.5 rounded-sm shadow-lg shadow-black/40 border border-[#D4AF37]/30">
                  <QRCodeSVG
                    value="https://filinvest-properties-explorer.vercel.app/"
                    size={80}
                    bgColor="#111c2e"
                    fgColor="#D4AF37"
                    level="M"
                  />
                </div>
                <span className="text-[8px] text-[#D4AF37]/60 uppercase tracking-[0.2em] font-bold font-sans">
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-y-auto bg-[#0a1220]"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <CursorGlow />
              <div className="max-w-7xl mx-auto w-full space-y-6 relative z-10 p-5 sm:p-8 lg:p-12 pb-32">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[#D4AF37] tracking-[0.35em] text-xs font-bold uppercase block">
                      Filinvest Townships
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-medium text-white mt-1">
                      Explore Commercial Portfolios
                    </h1>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('landing')}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-3.5 py-2 text-slate-400 hover:text-white border border-white/10 rounded-none bg-white/[0.01] hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                </div>

                {/* Vertical flow: Horizontal Hero above, then 3 columns below */}
                <div className="flex flex-col gap-6 w-full">

                  {/* HERO DETACHED MODULE: FILINVEST CITY (Featured Block 14 Launch) - HORIZONTAL COMPACT DESIGN */}
                  <div className="flex flex-col">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] font-sans">
                        Sovereign Priority Launch
                      </span>
                    </div>

                    {(() => {
                      const project = COMMERCIAL_PROJECTS.find(p => p.id === 'filinvest-city');
                      if (!project) return null;
                      return (
                        <div
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className="relative group bg-[#112440] border-2 border-[#D4AF37] overflow-hidden min-h-[220px] p-6 sm:p-8 flex flex-col md:flex-row justify-between cursor-pointer transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.08)] hover:shadow-[0_0_40px_rgba(212,175,55,0.18)]"
                        >
                          {/* Background Image overlay */}
                          <div className="absolute inset-0 z-0 select-none pointer-events-none">
                            <img
                              src={project.bgImage}
                              alt={project.name}
                              className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-all duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1726]/95 via-[#0e1726]/80 to-transparent" />
                          </div>

                          {/* Left side: Info & Copy */}
                          <div className="z-10 flex-1 flex flex-col justify-between space-y-4 md:pr-12">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <span className="bg-[#D4AF37] text-slate-950 text-[10px] uppercase font-bold tracking-[0.25em] px-3 py-1 rounded-none flex items-center justify-center gap-1.5 shadow-md w-fit">
                                <Sparkles size={11} fill="currentColor" />
                                Block 14 Featured Launch
                              </span>
                              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] px-2.5 py-1 uppercase font-bold tracking-widest border border-[#D4AF37]/25 w-fit">
                                {project.brand}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase flex items-center gap-1.5">
                                <MapPin size={11} /> {project.location}
                              </span>
                              <h2 className="text-2xl sm:text-3.5xl font-display font-medium text-white group-hover:text-amber-400 transition-colors leading-tight">
                                {project.name}
                              </h2>
                              <p className="text-sm text-slate-200 leading-relaxed font-sans max-w-2xl">
                                {project.fullDescription || project.shortDescription}
                              </p>
                            </div>
                          </div>

                          {/* Right side: Specs block & main Button */}
                          <div className="z-10 flex flex-col justify-between md:items-end md:text-right mt-6 md:mt-0 min-w-[220px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                            <div className="space-y-3 font-sans">
                              <div>
                                <span className="block uppercase text-[9px] tracking-widest text-slate-300 font-semibold">Avg Portion Sizing</span>
                                <span className="block text-white text-lg font-bold mt-0.5">{project.averageLotSize}</span>
                              </div>
                              <div>
                                <span className="block uppercase text-[9px] tracking-widest text-slate-300 font-semibold">Est. Market Rates</span>
                                <span className="block text-[#D4AF37] text-lg font-bold mt-0.5">{project.averagePriceRange}</span>
                              </div>
                            </div>

                            <button className="mt-4 md:mt-0 px-6 py-2.5 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-extrabold uppercase tracking-widest">
                              Explore Lots
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* PREMIUM TOWNSHIPS: THREE TALL CARDS BELOW FILINVEST CITY */}
                  <div className="flex flex-col">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 font-sans">
                        Premium Regional Portfolios
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {COMMERCIAL_PROJECTS.filter(p => p.id !== 'filinvest-city').map((project, idx) => {
                        return (
                          <div
                            key={project.id}
                            onClick={() => handleProjectSelect(project)}
                            className="relative group bg-[#111c2e] border border-white/5 hover:border-white/15 overflow-hidden min-h-[350px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]"
                          >
                            {/* Background Image overlay */}
                            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                              <img
                                src={project.bgImage}
                                alt={project.name}
                                className="w-full h-full object-cover opacity-15 group-hover:opacity-35 transition-all duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/95 via-[#0e1726]/75 to-transparent" />
                            </div>

                            {/* Top Tag */}
                            <div className="z-10">
                              <span className="bg-white/5 text-slate-300 text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 border border-white/5 inline-block font-sans">
                                {project.brand}
                              </span>
                            </div>

                            {/* Details & Specs */}
                            <div className="z-10 space-y-3 pt-6">
                              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1 font-sans">
                                <MapPin size={10} className="text-[#38BDF8]" /> {project.location.split(',')[0]}
                              </span>
                              <h2 className="text-xl font-display font-medium text-white group-hover:text-amber-400 transition-colors leading-tight">
                                {project.name}
                              </h2>
                              <p className="text-xs text-slate-200 leading-relaxed font-sans line-clamp-4">
                                {project.shortDescription}
                              </p>

                              {/* Specs grid */}
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 uppercase font-sans">
                                <div>
                                  <span className="block text-[9px] font-semibold tracking-widest text-slate-400">Avg Portion</span>
                                  <span className="block text-sm font-bold text-white mt-0.5">{project.averageLotSize}</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-semibold tracking-widest text-slate-400">Est. Rates</span>
                                  <span className="block text-sm font-bold text-[#D4AF37] mt-0.5">{project.averagePriceRange.split(' ')[0]} / sqm</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-end items-center text-[10px] uppercase font-bold tracking-widest z-10 font-sans">
                              <span className="text-amber-500 font-semibold group-hover:translate-x-1.5 transition-transform duration-200">Explore &rarr;</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
              className="absolute inset-0 flex flex-col bg-[#0a1220]"
            >

              {/* Top Persistent Navigation Header */}
              <header className="border-b border-white/10 bg-[#111c2e]/95 backdrop-blur px-4 sm:px-10 z-10 shrink-0 relative
                flex flex-col gap-3 py-3
                md:grid md:grid-cols-3 md:h-24 md:py-0 md:gap-0 md:items-center">
                {/* Row 1 on mobile: Back + Title + Admin */}
                <div className="flex items-center gap-3 justify-between md:justify-start">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setCurrentScreen('selection');
                        setSelectedLot(null);
                      }}
                      className="p-2 md:p-2.5 text-slate-400 hover:text-white border border-white/10 rounded-none bg-[#0a1220]/50 hover:bg-white/5 transition-all shrink-0"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className="min-w-0">
                      <h2 className="text-base md:text-2xl font-display font-medium text-white flex items-center gap-2 truncate">
                        <span className="truncate">{selectedProject.name}</span>
                        {selectedProject.id === 'filinvest-city' && (
                          <span className="text-[9px] md:text-[10px] bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/35 px-1.5 md:px-2.5 py-0.5 uppercase tracking-widest font-bold font-sans shrink-0">
                            Featured
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 uppercase tracking-widest truncate max-w-sm hidden md:block mt-0.5">
                        {selectedProject.location} • {selectedProject.brand}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 2 on mobile: Quick Switch Tabs */}
                <div className="flex items-center bg-[#0a1220] p-1 md:p-1.5 border border-white/10 justify-self-center w-full md:w-auto overflow-x-auto scrollbar-hide">
                  {COMMERCIAL_PROJECTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProjectSelect(p)}
                      className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] uppercase font-bold tracking-wider transition-all rounded-none whitespace-nowrap flex-1 md:flex-none ${selectedProject.id === p.id
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {p.id === 'filinvest-city' ? 'Alabang' : p.id === 'city-di-mare' ? 'Cebu' : p.id === 'daang-hari-lots' ? 'Cavite' : 'Laguna'}
                    </button>
                  ))}
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

              {/* Core Interactive Screen Layout */}
              <div className="flex-1 w-full flex flex-col md:flex-row relative overflow-hidden">

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
                  <div className="w-full md:w-[32rem] border-t md:border-t-0 md:border-l border-white/10 bg-[#0c1524] flex flex-col justify-between p-6 sm:p-8 shrink-0 h-[45vh] md:h-full z-10 overflow-y-auto">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                        <Building2 size={24} className="text-[#D4AF37]" />
                        <h3 className="font-display text-2xl font-semibold text-white">
                          Lot Parameters
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 font-sans text-sm">
                        <div className="lot-detail-item opacity-0">
                          <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                            <FileText size={14} /> Lot Identifier
                          </label>
                          <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                            {selectedLot.blockNumber} • {selectedLot.lotNumber}
                          </div>
                        </div>

                        <div className="lot-detail-item opacity-0">
                          <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                            <Maximize2 size={14} /> Lot Area
                          </label>
                          <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                            {selectedLot.areaSqm.toLocaleString()} sqm
                          </div>
                        </div>

                        <div className="lot-detail-item opacity-0">
                          <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                            <Layers size={14} /> FAR Limit
                          </label>
                          <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                            FAR {selectedLot.far}.0
                          </div>
                        </div>

                        <div className="lot-detail-item opacity-0">
                          <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                            <PhilippinePeso size={14} /> Price per SQM
                          </label>
                          <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                            ₱ {selectedLot.pricePerSqm.toLocaleString()}
                          </div>
                        </div>

                        {selectedLot.structureSize !== undefined && selectedLot.structurePrice !== undefined && (
                          <>
                            <div className="lot-detail-item opacity-0">
                              <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                                <Building2 size={14} /> Structure Size
                              </label>
                              <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                                {selectedLot.structureSize.toLocaleString()} sqm
                              </div>
                            </div>
                            <div className="lot-detail-item opacity-0">
                              <label className="text-xs uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1.5">
                                <PhilippinePeso size={14} /> Structure Price
                              </label>
                              <div className="text-lg font-semibold text-slate-200 mt-1 pl-5">
                                ₱ {selectedLot.structurePrice.toLocaleString()}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="lot-detail-item opacity-0 pt-4 border-t border-white/5 mt-2 sm:col-span-2">
                          <label className="text-xs uppercase text-[#D4AF37] tracking-widest font-mono font-bold flex items-center gap-1.5">
                            <PhilippinePeso size={14} className="text-[#D4AF37]" /> Total Contract Price (TCP)
                          </label>
                          <div className="text-3xl font-bold text-amber-400 mt-1.5 pl-5">
                            ₱ {((selectedLot.areaSqm * selectedLot.pricePerSqm) + (selectedLot.structurePrice || 0)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {inquiriesEnabled && (
                        <button
                          onClick={() => {
                            setFormSubmitted(false);
                            setShowInquiryModal(true);
                          }}
                          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow"
                        >
                          Inquire For This Lot
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
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
