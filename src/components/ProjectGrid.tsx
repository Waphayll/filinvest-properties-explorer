import { motion } from 'motion/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { CommercialProject } from '../types';

interface ProjectGridProps {
  projects: CommercialProject[];
  onSelectProject: (project: CommercialProject) => void;
  onBack: () => void;
}

const PROJECT_ACCENTS: Record<string, string> = {
  'filinvest-city': '#4FC3CF',
  'city-di-mare':   '#4FA0CF',
  'daang-hari':     '#CF9F4F',
  'village-front':  '#6FCF6F',
};

export default function ProjectGrid({ projects, onSelectProject, onBack }: ProjectGridProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-editorial-black/20 flex items-center px-10 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex-1 text-center text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
          Select a Project
        </div>
      </header>

      {/* 2×2 Grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-px bg-editorial-black/10 overflow-hidden">
        {projects.map((project, i) => {
          const accent = PROJECT_ACCENTS[project.id];
          const availableCount = project.lots.filter(l => l.status === 'available').length;
          return (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectProject(project)}
              className="bg-editorial-bg flex flex-col justify-between p-10 text-left group hover:bg-editorial-black/5 transition-colors"
            >
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.4em] font-bold mb-5"
                  style={{ color: accent }}
                >
                  {project.shortName}
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold italic leading-tight mb-3 group-hover:opacity-80 transition-opacity">
                  {project.name}
                </h2>
                <div className="flex items-center gap-2 opacity-40 mb-6">
                  <MapPin size={12} />
                  <span className="text-xs font-medium uppercase tracking-tight">{project.location}</span>
                </div>
                <p className="text-sm opacity-50 leading-relaxed line-clamp-2 font-normal">
                  {project.description}
                </p>
              </div>

              <div className="flex items-end justify-between mt-8">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-widest opacity-30 font-bold">Lot Cuts</div>
                  <div className="text-sm font-bold">{project.lotCuts}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[10px] uppercase tracking-widest opacity-30 font-bold">Price / sqm</div>
                  <div className="text-sm font-bold">{project.priceRange}</div>
                </div>
                <div
                  className="text-right ml-6"
                  style={{ color: accent }}
                >
                  <div className="text-3xl font-display font-bold italic">{availableCount}</div>
                  <div className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-70">Lots Available</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
