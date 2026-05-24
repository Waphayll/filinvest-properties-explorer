import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommercialProject, CommercialLot } from '../types';

interface ChatbotProps {
  projects: CommercialProject[];
  lots: CommercialLot[];
  onOpenInquiry: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({ projects, lots, onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Good day! Welcome to the Filinvest Commercial Portfolios Explorer. I am your Digital Investment Concierge. How may I assist you with our premium commercial lots today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'Which lots are available in Filinvest City?',
    'What is the maximum FAR limit?',
    'How do I submit a Letter of Intent?',
    'Show me the pricing for City di Mare Cebu.',
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate concierge typing
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      }]);
    }, 1200);
  };

  const generateBotResponse = (input: string): string => {
    const text = input.toLowerCase();

    // Creator / Developer Attribution Trigger
    if (
      text.includes('who made') ||
      text.includes('who created') ||
      text.includes('developer') ||
      text.includes('author') ||
      text.includes('creator') ||
      text.includes('maker') ||
      text.includes('rafael') ||
      text.includes('pelaez') ||
      text.includes('peria')
    ) {
      return "I was created by the GOAT of CPE 2026, the Lebron James of his profession, the 3 for 3 no miss, strongest CPE of today, Rafael Louis Pelaez Peria!";
    }

    // Specific Block/Lot Query Parsing
    const blockMatch = text.match(/block\s+(\w+)/) || text.match(/blk\s+(\w+)/);
    const lotMatch = text.match(/lot\s+([\w-]+)/);

    if (blockMatch || lotMatch) {
      let filteredLots = lots;
      if (blockMatch) {
        const blockName = blockMatch[1].toLowerCase();
        filteredLots = filteredLots.filter(l => l.blockNumber.toLowerCase().includes(blockName) || l.lotNumber.toLowerCase().includes(`blk ${blockName}`) || l.lotNumber.toLowerCase().includes(`block ${blockName}`));
      }
      if (lotMatch) {
        const lotName = lotMatch[1].toLowerCase();
        filteredLots = filteredLots.filter(l => l.lotNumber.toLowerCase().includes(`lot ${lotName}`) || l.lotNumber.toLowerCase().includes(lotName));
      }

      if (filteredLots.length === 1) {
        const lot = filteredLots[0];
        const tcp = (lot.areaSqm * lot.pricePerSqm) + (lot.structurePrice || 0);
        return `Here are the details for ${lot.blockNumber} ${lot.lotNumber}:\n• Status: ${lot.status}\n• Size: ${lot.areaSqm.toLocaleString()} sqm\n• Price per sqm: ₱${lot.pricePerSqm.toLocaleString()}\n• FAR Limit: ${lot.far}.0\n• Total Contract Price: ₱${tcp.toLocaleString()}`;
      } else if (filteredLots.length > 1 && filteredLots.length <= 5) {
        const names = filteredLots.map(l => `${l.blockNumber} ${l.lotNumber}`).join(', ');
        return `I found multiple lots matching your query: ${names}. Could you be more specific?`;
      }
    }

    // Budget/Price Parsing
    if (text.includes("price") || text.includes("how much") || text.includes("cost") || text.includes("budget") || text.includes("below") || text.includes("under")) {
       const priceMatch = text.match(/(?:under|below|less than|maximum)\s*(?:of\s*)?(?:php|p|₱)?\s*([\d,]+)/i);
       if (priceMatch) {
           const budget = parseInt(priceMatch[1].replace(/,/g, ''));
           if (!isNaN(budget)) {
               const affordableLots = lots.filter(l => l.pricePerSqm <= budget && l.status === 'Available');
               return `We have ${affordableLots.length} available lots with a price per sqm under ₱${budget.toLocaleString()}. Would you like to explore them in a specific location?`;
           }
       }
    }

    // 1. Filinvest City / Alabang
    if (text.includes('filinvest city') || text.includes('alabang')) {
      const avail = lots.filter(l => l.projectId === 'filinvest-city' && l.status === 'Available').length;
      return `Filinvest City in Alabang is our premier 244-hectare green-certified garden business district. We currently have ${avail} premium commercial lots available, including high-density slots in Block 13 (Palms) and Block 14 (Spectrum) with FAR limits up to 10.0. Prices range from ₱396,000 to ₱766,000 per sqm.`;
    }

    // 2. City di Mare / Cebu
    if (text.includes('city di mare') || text.includes('cebu') || text.includes('mare')) {
      const avail = lots.filter(l => l.projectId === 'city-di-mare' && l.status === 'Available').length;
      return `City di Mare is a vibrant 58-hectare master-planned coastal district at the South Road Properties, Cebu City. We currently feature ${avail} premier waterfront commercial lots in our Greenway (Block 1) and Coastal (Block 2) sectors. Ideal for lifestyle commercial strips, regional headquarters, or high-density retail enclaves.`;
    }

    // 3. Daang Hari
    if (text.includes('daang hari') || text.includes('cavite')) {
      const avail = lots.filter(l => l.projectId === 'daang-hari-lots' && l.status === 'Available').length;
      return `Our Daang Hari Commercial Lots offer maximum exposure along the highly congested Las Piñas - Cavite Corridor. Perfect for high-density commercial centers, drive-thrus, and offices, with ${avail} lot slots ready for acquisition.`;
    }

    // 4. Brentville / Laguna
    if (text.includes('brentville') || text.includes('laguna') || text.includes('mamplasan')) {
      return `Brentville (The Village Front) in Mamplasan, Biñan, Laguna is a prestigious boutique suburban community right at the Mamplasan Exit (SLEX). We feature exclusive premium commercial lots (sizes from 780 to 1,244 sqm) tailored for high-end boutique retail, medical clinics, and specialty grocers.`;
    }

    // 5. FAR Limit
    if (text.includes('far') || text.includes('floor area ratio') || text.includes('limit') || text.includes('height')) {
      return `Our commercial lots offer flexible Floor Area Ratio (FAR) profiles to maximize your structural yield:
• Filinvest City (Palms/Spectrum): FAR 6.0 to FAR 10.0
• City di Mare (Cebu): FAR 12.0 to 16.0 (for premier high-rise waterfront structures)
• Daang Hari & Brentville: Low-density FAR 2.0 (ideal for commercial/retail frontages)`;
    }

    // 6. Letter of Intent / Inquire / Buy
    if (text.includes('inquire') || text.includes('buy') || text.includes('reserve') || text.includes('submit') || text.includes('letter') || text.includes('contact') || text.includes('intent')) {
      return `To reserve a prime lot or request an official Investment Sheet, you can click on the "Inquire Now" button at the top header or tap on any available lot polygon on the map and choose "Submit Inquiry Sheet". You can also leave your details directly, and one of our premium commercial directors will contact you within 24 hours.`;
    }

    // 7. Available
    if (text.includes('available') || text.includes('status') || text.includes('vacant')) {
      const totalAvail = lots.filter(l => l.status === 'Available').length;
      return `Across all our active portfolios, we currently have ${totalAvail} premium commercial lots marked as "Available" for immediate developer acquisition. You can view their layouts on our interactive actual and concept maps.`;
    }

    // Default response
    return `Thank you for your interest. As a premium developer partner, we cater to tailored office, commercial, and high-density residential layouts. Please let me know which location you are interested in (Alabang, Cebu, Cavite, or Laguna) or if you would like me to connect you with our Commercial Director for a direct presentation.`;
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9990] w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group border border-amber-400/20 active:scale-95"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={22} className="text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0a1220]"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-6 z-[9990] w-[90vw] sm:w-[380px] h-[500px] backdrop-blur-md bg-[#0c1524]/95 border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-lg font-sans"
          >
            {/* Header */}
            <div className="bg-[#080d17] border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1e2d42] border border-[#D4AF37]/30 flex items-center justify-center">
                  <Bot size={16} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
                    Filinvest Concierge
                    <Sparkles size={11} className="text-[#D4AF37] animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-sm text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                        : 'bg-[#152238] border border-white/5 text-slate-100'
                    }`}
                  >
                    {msg.text}
                    <span className="block text-[8px] text-slate-400 text-right mt-1.5 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#152238] border border-white/5 px-3.5 py-2.5 rounded-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Chips) */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#0a1220]/80 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-full bg-[#18273e] hover:bg-[#203452] border border-white/5 text-slate-300 text-[10px] font-medium transition-all active:scale-95 flex items-center gap-1"
                >
                  <HelpCircle size={10} className="text-[#D4AF37]" />
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-[#080d17] border-t border-white/10 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about lots, prices, FAR ratios..."
                className="flex-1 bg-[#101926] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
