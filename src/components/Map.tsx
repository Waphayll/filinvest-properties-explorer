import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Project } from '../types';
import { BRAND_COLORS } from '../constants';
import { cn } from '../lib/utils';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  projects: Project[];
  center: [number, number];
  activeProject?: Project | null;
  onExploreClick: (project: Project) => void;
  centerTrigger?: number;
}

function ChangeView({ center, zoom, centerTrigger }: { center: [number, number]; zoom: number; centerTrigger?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map, centerTrigger]);
  return null;
}

const ProjectMap: React.FC<MapProps> = ({ projects, center, activeProject, onExploreClick, centerTrigger }) => {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    if (activeProject && markerRefs.current[activeProject.id]) {
      markerRefs.current[activeProject.id]?.openPopup();
    }
  }, [activeProject]);

  return (
    <div id="map-container" className="w-full h-full relative group">
      {/* Editorial Decorative Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1a1a1a 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full z-0 grayscale-[0.2] contrast-[1.1]"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={activeProject ? 16 : 13} centerTrigger={centerTrigger} />
        {projects.map((project) => (
          <Marker 
            key={project.id} 
            position={project.coordinates}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[project.id] = ref;
              }
            }}
          >
            <Popup>
              <div 
                className="p-5 min-w-[240px] text-white relative overflow-hidden flex flex-col"
                style={project.imageUrl ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url(${project.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {
                  backgroundColor: '#0f172a'
                }}
              >
                <div 
                  className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2 border-b pb-1 opacity-90"
                  style={{ color: BRAND_COLORS[project.brand], borderColor: BRAND_COLORS[project.brand] + '60' }}
                >
                  {project.brand}
                </div>
                <h3 className="font-display text-lg font-bold leading-tight mb-2 italic text-white">
                  {project.name}
                </h3>
                
                <p className="text-[10px] text-white/70 mb-4 leading-relaxed font-sans uppercase tracking-tight">
                  {project.location}
                </p>
                <div className="bg-white/10 p-3 border border-white/20 backdrop-blur-sm mb-4">
                   <p className="text-[10px] leading-relaxed italic text-white/90">
                    {project.description}
                  </p>
                </div>

                <button 
                  onClick={() => onExploreClick(project)}
                  className="w-full py-2 bg-white text-editorial-bg uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-opacity-90 transition-colors"
                >
                  Explore
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Editorial Map Title Index */}
      <div className="absolute bottom-10 right-10 z-20 bg-editorial-bg border border-editorial-black p-8 w-80 shadow-2xl hidden lg:block">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 opacity-40 italic">Property Registry</div>
        <div className="space-y-3">
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className={cn(
              "flex items-center space-x-3 transition-opacity duration-300",
              activeProject?.id === p.id ? "opacity-100" : "opacity-40"
            )}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[p.brand] }} />
              <span className="text-[11px] font-medium tracking-tight truncate">{p.name}</span>
            </div>
          ))}
          {projects.length > 4 && (
            <div className="text-[10px] uppercase tracking-widest opacity-30 pt-2 border-t border-editorial-black/10">
              + {projects.length - 4} More Destinations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
