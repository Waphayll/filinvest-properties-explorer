import { useState } from 'react';
import { CommercialProject, Lot } from './types';
import { PROJECTS } from './constants';
import LandingScreen from './components/LandingScreen';
import ProjectGrid from './components/ProjectGrid';
import ProjectView from './components/ProjectView';

type Screen = 'landing' | 'projects' | 'project';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedProject, setSelectedProject] = useState<CommercialProject | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const handleSelectProject = (project: CommercialProject) => {
    setSelectedProject(project);
    setSelectedLot(null);
    setScreen('project');
  };

  const handleBack = () => {
    if (screen === 'project') {
      setSelectedLot(null);
      setScreen('projects');
    } else if (screen === 'projects') {
      setScreen('landing');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-editorial-bg text-editorial-black font-sans">
      {screen === 'landing' && (
        <LandingScreen onEnter={() => setScreen('projects')} />
      )}
      {screen === 'projects' && (
        <ProjectGrid
          projects={PROJECTS}
          onSelectProject={handleSelectProject}
          onBack={handleBack}
        />
      )}
      {screen === 'project' && selectedProject && (
        <ProjectView
          project={selectedProject}
          selectedLot={selectedLot}
          onSelectLot={setSelectedLot}
          onBack={handleBack}
          onSwitchProject={handleSelectProject}
          allProjects={PROJECTS}
        />
      )}
    </div>
  );
}
