import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, User, Phone, Mail, Briefcase } from 'lucide-react';
import { CommercialProject, CommercialLot, InvestorLead } from '../types';

interface InquiryModalProps {
  showModal: boolean;
  onClose: () => void;
  selectedProject: CommercialProject | null;
  selectedLot: CommercialLot | null;
  onLeadSubmit: (lead: InvestorLead) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  showModal,
  onClose,
  selectedProject,
  selectedLot,
  onLeadSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    broker: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

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

    onLeadSubmit(newLead);
    setFormSubmitted(true);

    // Smooth timer matching user design to auto close
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', contactNumber: '', email: '', broker: '' });
        setErrors({});
      }, 300);
    }, 2500);
  };

  if (!showModal) return null;

  return (
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
            <h4 className="text-[9px] font-bold tracking-[0.3em] uppercase text-blue-400">
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
            onClick={() => {
                onClose();
                setFormSubmitted(false);
                setFormData({ name: '', contactNumber: '', email: '', broker: '' });
                setErrors({});
            }}
            className="p-1.5 bg-[#0a1220] border border-white/10 hover:text-blue-400 transition-all text-slate-400"
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
                <span className="font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 border border-blue-500/25">
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
                className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
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
                className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
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
                className="w-full bg-[#0a1220] border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
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
                onClick={() => {
                    onClose();
                    setFormSubmitted(false);
                    setFormData({ name: '', contactNumber: '', email: '', broker: '' });
                    setErrors({});
                }}
                className="flex-1 py-3 bg-[#0a1220] border border-white/10 hover:bg-white/5 text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all shadow"
              >
                Submit Sheet
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InquiryModal;
