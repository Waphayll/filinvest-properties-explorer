import React from 'react';
import { Project, Brand } from '../types';
import { BRAND_COLORS } from '../constants';
import { MapPin, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SidebarProps {
  projects: Project[];
  activeProject: Project | null;
  onProjectClick: (project: Project) => void;
  onExploreClick: (project: Project) => void;
  selectedBrand: Brand | 'All';
  onBrandSelect: (brand: Brand | 'All') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProject, 
  onProjectClick,
  onExploreClick,
  selectedBrand,
  onBrandSelect
}) => {
  const brands: (Brand | 'All')[] = ['All', 'Filigree', 'Aspire', 'Prestige', 'Office Spaces'];

  const brandBadges: Record<string, string> = {
    'All': 'OVERVIEW',
    'Filigree': 'ULTRA LUXE',
    'Aspire': 'HIGH END',
    'Prestige': 'EXCLUSIVE',
    'Office Spaces': 'CORPORATE'
  };

  return (
    <div className="w-80 h-full bg-editorial-bg overflow-hidden flex flex-col border-r border-editorial-black">
      <div className="p-8 border-b border-editorial-black">
        <div className="text-[10px] uppercase tracking-[0.3em] text-editorial-black/50 mb-6">Product Lines</div>
        <div className="space-y-4">
          {brands.map((brand) => (
            <div 
              key={brand}
              onClick={() => onBrandSelect(brand)}
              className={cn(
                "flex justify-between items-baseline group cursor-pointer transition-all duration-300",
                selectedBrand === brand ? "opacity-100" : "opacity-30 hover:opacity-100"
              )}
            >
              <span className="text-xl font-display italic font-bold tracking-tight">
                {brand}
              </span>
              <span className={cn(
                "text-[10px] px-2 py-0.5 font-bold tracking-widest transition-colors duration-300",
                selectedBrand === brand 
                  ? "bg-editorial-black text-editorial-bg" 
                  : "border border-editorial-black text-editorial-black"
              )}>
                {brandBadges[brand]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="group cursor-pointer relative"
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                   <div 
                    className="text-[10px] uppercase tracking-[0.2em] font-bold"
                    style={{ color: BRAND_COLORS[project.brand] }}
                  >
                    {project.brand}
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-transform duration-500",
                    activeProject?.id === project.id ? "scale-150 rotate-45" : "scale-100"
                  )} style={{ backgroundColor: BRAND_COLORS[project.brand] }} />
                </div>

                <h2 className={cn(
                  "text-3xl font-display leading-tight mb-4 transition-all duration-500",
                  activeProject?.id === project.id ? "italic" : "group-hover:italic"
                )}>
                  {project.name}
                </h2>
                
                <p className="text-sm leading-relaxed text-editorial-black/60 mb-6 italic line-clamp-2">
                  {project.description}
                </p>

                <div className={cn(
                  "space-y-3 transition-all duration-700 overflow-hidden",
                  activeProject?.id === project.id ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
                )}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreClick(project);
                    }}
                    className="w-full mt-4 py-4 border border-editorial-black uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-editorial-black hover:text-white transition-colors"
                  >
                    Explore
                  </button>
                </div>

                {/* Separator */}
                <div className="pt-4 border-b border-editorial-black/5" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
