import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Send } from 'lucide-react';
import { Lot, CommercialProject } from '../types';
import { cn } from '../lib/utils';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLot: Lot | null;
  project: CommercialProject | null;
}

interface FormState {
  name: string;
  contact: string;
  email: string;
  broker: string;
}

const EMPTY_FORM: FormState = { name: '', contact: '', email: '', broker: '' };

function formatPhp(amount: number): string {
  if (amount >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000)     return `₱${(amount / 1_000_000).toFixed(1)}M`;
  return `₱${amount.toLocaleString()}`;
}

export default function LeadCaptureModal({ isOpen, onClose, selectedLot, project }: LeadCaptureModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim())    next.name    = 'Required';
    if (!form.contact.trim()) next.contact = 'Required';
    if (!form.email.trim())   next.email   = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // In production this would POST to a CRM / email endpoint
    console.log('Lead captured:', { ...form, project: project?.name, lot: selectedLot?.id });
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset after exit animation completes
    setTimeout(() => { setForm(EMPTY_FORM); setErrors({}); setSubmitted(false); }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-editorial-bg/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg bg-editorial-bg border border-editorial-black/20 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-1.5 opacity-30 hover:opacity-80 transition-opacity"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <SuccessState onClose={handleClose} />
            ) : (
              <div className="p-10">
                <div className="mb-8">
                  <div className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 mb-3">
                    Investor Inquiry
                  </div>
                  <h2 className="text-3xl font-display font-bold italic leading-tight">
                    Leave Your Details
                  </h2>
                  <p className="text-sm opacity-40 mt-2 leading-relaxed">
                    Our team will follow up with you after the event.
                  </p>
                </div>

                {/* Lot context pill */}
                {selectedLot && project && (
                  <div className="mb-8 px-4 py-3 border border-editorial-black/15 bg-editorial-black/5 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-[9px] uppercase tracking-widest opacity-30 font-bold">Interested in</div>
                      <div className="text-sm font-bold mt-0.5">
                        {project.shortName} · Blk {selectedLot.block}, Lot {selectedLot.lotNumber}
                        {selectedLot.district && <span className="opacity-40 ml-2 font-normal">({selectedLot.district})</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-widest opacity-30 font-bold">TCP</div>
                      <div className="text-sm font-bold mt-0.5">{formatPhp(selectedLot.tcp)}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <Field
                    label="Full Name"
                    required
                    value={form.name}
                    error={errors.name}
                    onChange={v => setForm(f => ({ ...f, name: v }))}
                    placeholder="Juan dela Cruz"
                  />
                  <Field
                    label="Contact Number"
                    required
                    value={form.contact}
                    error={errors.contact}
                    onChange={v => setForm(f => ({ ...f, contact: v }))}
                    placeholder="+63 9XX XXX XXXX"
                    type="tel"
                  />
                  <Field
                    label="Email Address"
                    required
                    value={form.email}
                    error={errors.email}
                    onChange={v => setForm(f => ({ ...f, email: v }))}
                    placeholder="juan@example.com"
                    type="email"
                  />
                  <Field
                    label="Broker / Agent"
                    value={form.broker}
                    onChange={v => setForm(f => ({ ...f, broker: v }))}
                    placeholder="Optional"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full mt-8 py-4 bg-editorial-black text-editorial-bg flex items-center justify-center gap-3 uppercase text-xs tracking-[0.4em] font-bold hover:opacity-90 transition-opacity"
                >
                  <Send size={14} />
                  Submit Inquiry
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label, value, onChange, placeholder, required, error, type = 'text'
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; error?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 mb-2">
        {label}{required && <span className="opacity-60 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-transparent border px-4 py-3 text-sm font-medium placeholder:opacity-20 outline-none transition-colors',
          error
            ? 'border-red-400/60 focus:border-red-400'
            : 'border-editorial-black/20 focus:border-editorial-black/60'
        )}
      />
      {error && <p className="text-[10px] text-red-400 mt-1 font-bold">{error}</p>}
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-12 flex flex-col items-center text-center"
    >
      <CheckCircle size={40} className="opacity-60 mb-6" />
      <h3 className="text-3xl font-display font-bold italic mb-3">Thank You</h3>
      <p className="text-sm opacity-50 leading-relaxed mb-10">
        Your inquiry has been received.<br />Our team will be in touch after the event.
      </p>
      <button
        onClick={onClose}
        className="px-10 py-3 border border-editorial-black/30 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-editorial-black/10 transition-colors"
      >
        Continue Exploring
      </button>
    </motion.div>
  );
}
