import React, { useState } from 'react';
import { CommercialLot, CommercialProject, InvestorLead } from '../types';
import { Send, CheckCircle2, User, Phone, Mail, Award, X } from 'lucide-react';

interface LeadCaptureFormProps {
  activeProject: CommercialProject;
  activeLot: CommercialLot | null;
  onLeadSubmit: (lead: Omit<InvestorLead, 'id' | 'timestamp'>) => void;
  onCloseLotSelection?: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  activeProject,
  activeLot,
  onLeadSubmit,
  onCloseLotSelection
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    brokerName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onLeadSubmit({
      name: formData.name.trim(),
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim(),
      brokerName: formData.brokerName.trim() || undefined,
      selectedProjectName: activeProject.name,
      selectedLotNumber: activeLot ? `${activeLot.blockNumber} - ${activeLot.lotNumber}` : 'General Inquiry'
    });

    setSuccess(true);
    setFormData({ name: '', contactNumber: '', email: '', brokerName: '' });

    // Success auto dismiss after 4 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-white/[0.02] border border-editorial-black/10 p-6 md:p-8 relative">
      {success ? (
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 animate-fade-in">
          <CheckCircle2 size={48} className="text-emerald-400" />
          <h3 className="font-display text-2xl italic font-bold">Inquiry Logged Securely</h3>
          <p className="text-xs opacity-70 max-w-sm leading-relaxed">
            Thank you. Your investment request for <span className="text-white font-semibold">{activeProject.name}</span> {activeLot && `(${activeLot.lotNumber})`} has been catalogued in our digital ledger. A premier portfolio officer will contact you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-editorial-black/10">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">Interactive Desk</h4>
              <h3 className="font-display text-xl italic font-semibold">Initiate Investor Inquiry</h3>
            </div>
            {activeLot && (
              <span className="bg-editorial-black/10 border border-editorial-black/20 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 scale-95">
                {activeLot.lotNumber}
              </span>
            )}
          </div>

          <div className="text-[11px] opacity-60 leading-relaxed">
            {activeLot ? (
              <p>
                You are initiating an priority acquisition protocol for <span className="text-white font-medium">{activeLot.blockNumber}, {activeLot.lotNumber}</span> ({activeLot.areaSqm.toLocaleString()} sqm) within {activeProject.name}.
              </p>
            ) : (
              <p>Fill out the form below to register your investment profile for general lot inquiries within {activeProject.name}.</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest opacity-50 block">Name of Attendee *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Senator Arthur Pendelton"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-editorial-bg text-white placeholder-white/20 border border-editorial-black/10 hover:border-editorial-black/20 focus:border-white focus:outline-none px-10 py-3 text-xs tracking-wide transition-all"
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-400 font-semibold mt-0.5">{errors.name}</p>}
            </div>

            {/* Grid for Contact / Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 block">Contact Number *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30">
                    <Phone size={14} />
                  </span>
                  <input
                    type="tel"
                    placeholder="+63 917 123 4567"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full bg-editorial-bg text-white placeholder-white/20 border border-editorial-black/10 hover:border-editorial-black/20 focus:border-white focus:outline-none px-10 py-3 text-xs tracking-wide transition-all"
                  />
                </div>
                {errors.contactNumber && <p className="text-[10px] text-red-400 font-semibold mt-0.5">{errors.contactNumber}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 block">Email Address *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30">
                    <Mail size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="investor@filinvest.com.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-editorial-bg text-white placeholder-white/20 border border-editorial-black/10 hover:border-editorial-black/20 focus:border-white focus:outline-none px-10 py-3 text-xs tracking-wide transition-all"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-400 font-semibold mt-0.5">{errors.email}</p>}
              </div>
            </div>

            {/* Broker */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[9px] uppercase tracking-widest opacity-50 block">Broker Name / Agency</label>
                <span className="text-[8px] uppercase tracking-widest opacity-30">Optional</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30">
                  <Award size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Filinvest Luxe Realty"
                  value={formData.brokerName}
                  onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                  className="w-full bg-editorial-bg text-white placeholder-white/20 border border-editorial-black/10 hover:border-editorial-black/20 focus:border-white focus:outline-none px-10 py-3 text-xs tracking-wide transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4.5 bg-white text-editorial-bg hover:bg-neutral-200 uppercase text-[10px] tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>Lock Priority Reservation Inquiry</span>
            <Send size={12} />
          </button>
        </form>
      )}
    </div>
  );
};

export default LeadCaptureForm;
