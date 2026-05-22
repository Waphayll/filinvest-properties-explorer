import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, X, Building2, Ruler, Tag, BarChart3, Layers, MessageSquare } from 'lucide-react';
import { CommercialProject, Lot } from '../types';
import { cn } from '../lib/utils';
import LeadCaptureModal from './LeadCaptureModal';

interface ProjectViewProps {
  project: CommercialProject;
  selectedLot: Lot | null;
  onSelectLot: (lot: Lot | null) => void;
  onBack: () => void;
  onSwitchProject: (project: CommercialProject) => void;
  allProjects: CommercialProject[];
}

const PROJECT_ACCENTS: Record<string, string> = {
  'filinvest-city': '#4FC3CF',
  'city-di-mare':   '#4FA0CF',
  'daang-hari':     '#CF9F4F',
  'village-front':  '#6FCF6F',
};

function formatPhp(amount: number): string {
  if (amount >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000)     return `₱${(amount / 1_000_000).toFixed(1)}M`;
  return `₱${amount.toLocaleString()}`;
}

function formatSqm(area: number): string {
  return `${area.toLocaleString()} sqm`;
}

// Group lots by district for multi-district projects
function groupByDistrict(lots: Lot[]): Record<string, Lot[]> {
  return lots.reduce<Record<string, Lot[]>>((acc, lot) => {
    const key = lot.district ?? 'Block ' + lot.block;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lot);
    return acc;
  }, {});
}

export default function ProjectView({
  project, selectedLot, onSelectLot, onBack, onSwitchProject, allProjects
}: ProjectViewProps) {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const accent = PROJECT_ACCENTS[project.id];
  const groups = groupByDistrict(project.lots);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-editorial-black/20 flex items-center px-10 gap-6 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={14} />
          Projects
        </button>

        <div className="h-5 w-px bg-editorial-black/20" />

        {/* Project switcher */}
        <div className="relative">
          <button
            onClick={() => setProjectMenuOpen(v => !v)}
            className="flex items-center gap-3 text-sm font-bold hover:opacity-70 transition-opacity"
          >
            <span style={{ color: accent }} className="text-[10px] uppercase tracking-[0.3em] font-bold">
              {project.shortName}
            </span>
            <span className="font-display italic text-lg">{project.name}</span>
            <ChevronDown size={14} className="opacity-40" />
          </button>

          <AnimatePresence>
            {projectMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 mt-2 bg-editorial-bg border border-editorial-black/20 shadow-2xl z-50 min-w-[280px]"
              >
                {allProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onSwitchProject(p); setProjectMenuOpen(false); }}
                    className={cn(
                      'w-full text-left px-6 py-4 hover:bg-editorial-black/10 transition-colors flex items-center gap-3',
                      p.id === project.id && 'bg-editorial-black/5'
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold w-8" style={{ color: PROJECT_ACCENTS[p.id] }}>
                      {p.shortName}
                    </span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto text-[10px] uppercase tracking-[0.3em] opacity-30 font-bold">
          {project.lots.filter(l => l.status === 'available').length} lots available
        </div>
      </header>

      {/* Body: lot grid + detail panel */}
      <div className="flex-1 overflow-hidden flex">
        {/* Lot Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {Object.entries(groups).map(([district, lots]) => (
            <div key={district} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">{district}</span>
                <div className="flex-1 h-px bg-editorial-black/10" />
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-25 font-bold">{lots.length} lots</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {lots.map(lot => {
                  const isSelected = selectedLot?.id === lot.id;
                  return (
                    <motion.button
                      key={lot.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onSelectLot(isSelected ? null : lot)}
                      className={cn(
                        'relative border text-left p-4 transition-all duration-200',
                        isSelected
                          ? 'border-editorial-black bg-editorial-black text-editorial-bg'
                          : 'border-editorial-black/20 bg-editorial-black/5 hover:border-editorial-black/50'
                      )}
                      style={isSelected ? {} : { borderLeftColor: accent, borderLeftWidth: 3 }}
                    >
                      <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold mb-1">
                        Blk {lot.block} · Lot {lot.lotNumber}
                      </div>
                      <div className="text-lg font-display font-bold italic leading-tight">
                        {lot.lotArea.toLocaleString()}
                        <span className="text-[10px] font-sans not-italic font-normal ml-1 opacity-60">sqm</span>
                      </div>
                      <div className={cn('text-[10px] font-bold mt-2', isSelected ? 'opacity-70' : 'opacity-50')}>
                        {formatPhp(lot.tcp)}
                      </div>
                      {lot.hasStructure && (
                        <div className="absolute top-2 right-2">
                          <Building2 size={10} className={isSelected ? 'opacity-60' : 'opacity-30'} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedLot ? (
            <motion.aside
              key="detail-panel"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-80 border-l border-editorial-black/20 flex flex-col shrink-0 overflow-y-auto"
            >
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 mb-2">Lot Details</div>
                    <h3 className="text-3xl font-display font-bold italic leading-tight">
                      Blk {selectedLot.block}<br />Lot {selectedLot.lotNumber}
                    </h3>
                    {selectedLot.district && (
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mt-2">
                        {selectedLot.district}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectLot(null)}
                    className="p-1 opacity-30 hover:opacity-80 transition-opacity mt-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-6 border-t border-editorial-black/10 pt-8">
                  <DetailRow icon={<Ruler size={13} />} label="Lot Area" value={formatSqm(selectedLot.lotArea)} />
                  <DetailRow icon={<Tag size={13} />} label="Price / sqm" value={`₱${selectedLot.pricePerSqm.toLocaleString()}`} />
                  <DetailRow icon={<Layers size={13} />} label="Total Contract Price" value={formatPhp(selectedLot.tcp)} large />
                  <DetailRow icon={<BarChart3 size={13} />} label="FAR" value={`${selectedLot.far}×`} />
                </div>

                {selectedLot.hasStructure && (
                  <div className="mt-8 pt-8 border-t border-editorial-black/10">
                    <div className="flex items-center gap-2 mb-5">
                      <Building2 size={13} />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">Includes Structure</span>
                    </div>
                    <div className="space-y-4 pl-5 border-l-2 border-editorial-black/20">
                      <DetailRow icon={<Ruler size={12} />} label="Structure Area" value={formatSqm(selectedLot.structureArea!)} />
                      <DetailRow icon={<Tag size={12} />} label="Structure Price" value={formatPhp(selectedLot.structurePrice!)} />
                      <DetailRow icon={<Layers size={12} />} label="Combined TCP" value={formatPhp(selectedLot.structureTcp!)} large />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-editorial-black/10 space-y-3">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="w-full py-3 bg-editorial-black text-editorial-bg flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.4em] font-bold hover:opacity-90 transition-opacity"
                >
                  <MessageSquare size={12} />
                  Inquire About This Lot
                </button>
                <div className="text-[9px] uppercase tracking-[0.2em] opacity-20 text-center font-bold">
                  Touch another lot to compare
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.aside
              key="prompt-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-80 border-l border-editorial-black/20 flex items-center justify-center shrink-0"
            >
              <div className="text-center px-8 opacity-20">
                <div className="w-12 h-12 border border-editorial-black/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={20} />
                </div>
                <div className="text-sm font-bold uppercase tracking-widest">Select a Lot</div>
                <div className="text-xs mt-2 opacity-70">Tap any lot to view details</div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Project summary footer */}
      <footer className="h-12 border-t border-editorial-black/20 flex items-center px-10 gap-8 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-30 font-bold">{project.farRange}</span>
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-30 font-bold">{project.priceRange}</span>
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-30 font-bold">{project.lotCuts}</span>
        <button
          onClick={() => setInquiryOpen(true)}
          className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity"
        >
          <MessageSquare size={12} />
          Inquire
        </button>
      </footer>

      <LeadCaptureModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        selectedLot={selectedLot}
        project={project}
      />
    </div>
  );
}

function DetailRow({ icon, label, value, large }: { icon: import('react').ReactNode; label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="opacity-30 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-bold mb-0.5">{label}</div>
        <div className={cn('font-bold', large ? 'text-xl font-display italic' : 'text-sm')}>{value}</div>
      </div>
    </div>
  );
}
