/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Project, Brand } from './types';
import { PROJECTS } from './constants';
import Sidebar from './components/Sidebar';
import ProjectMap from './components/Map';
import ExploreModal from './components/ExperienceModal';

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'All'>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [exploreProject, setExploreProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0);

  const filteredProjects = useMemo(() => {
    return selectedBrand === 'All' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.brand === selectedBrand);
  }, [selectedBrand]);

  const mapCenter = useMemo((): [number, number] => {
    if (activeProject) return activeProject.coordinates;
    if (filteredProjects.length > 0) {
      // Default to the first project in the filtered list
      return filteredProjects[0].coordinates;
    }
    return [14.4173, 121.0424]; // Default Alabang
  }, [activeProject, filteredProjects]);

  const handleOpenExplore = (project: Project) => {
    setExploreProject(project);
    setIsModalOpen(true);
    setActiveProject(project); // Sync map when experiencing
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-editorial-bg text-editorial-black font-sans">
      {/* Editorial Header */}
      <header className="h-20 border-b border-editorial-black flex items-center justify-between px-10 bg-editorial-bg z-50 shrink-0">
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-display tracking-tight font-black uppercase italic">Project View</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          projects={filteredProjects}
          activeProject={activeProject}
          onProjectClick={(project) => {
            setActiveProject(project);
            setCenterTrigger(prev => prev + 1);
          }}
          onExploreClick={handleOpenExplore}
          selectedBrand={selectedBrand}
          onBrandSelect={(brand) => {
            setSelectedBrand(brand);
            setActiveProject(null);
          }}
        />
        <main className="flex-1 h-full relative">
          <ProjectMap 
            projects={filteredProjects}
            center={mapCenter}
            activeProject={activeProject}
            onExploreClick={handleOpenExplore}
            centerTrigger={centerTrigger}
          />
          
          {/* Mobile Overlay Hint */}
          <div className="absolute bottom-6 right-6 z-10 md:hidden pointer-events-none">
            <div className="bg-editorial-bg/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-editorial-black">
              <p className="text-[10px] font-bold uppercase tracking-wider text-editorial-black">
                Interactive Explorer
              </p>
            </div>
          </div>
        </main>
      </div>

      <ExploreModal 
        project={exploreProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="h-12 border-t border-editorial-black bg-editorial-bg flex items-center justify-center px-10 text-[9px] uppercase tracking-[0.2em] font-bold shrink-0">
        <div className="flex space-x-2">
          <span>&copy; 2026 Filinvest Alabang Inc.</span>
          <span>All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
