import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CommercialLot, CommercialProject } from '../types';
import { BRAND_COLORS_COMMERCIAL } from '../constants';


interface InteractiveSDPProps {
  project: CommercialProject;
  lots: CommercialLot[];
  selectedLot: CommercialLot | null;
  onLotSelect: (lot: CommercialLot) => void;
}

// MapUpdater helper component to smoothly update views when projects are switched in the parent tab switcher
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);
  return null;
};

// SelectedLotUpdater helper to pan map when a specific lot is selected via sidebar list click
const SelectedLotUpdater: React.FC<{ selectedLot: CommercialLot | null }> = ({ selectedLot }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLot?.coordinates && selectedLot.coordinates.length > 0) {
      map.setView(selectedLot.coordinates[0], 17, { animate: true, duration: 0.6 });
    }
  }, [selectedLot, map]);
  return null;
};

const InteractiveSDP: React.FC<InteractiveSDPProps> = ({
  project,
  lots,
  selectedLot,
  onLotSelect,
}) => {
  // Mapped center coordinate & zoom
  const centerCoord: [number, number] = project.center || [14.4150, 121.0360];
  const defaultZoom = project.zoom || 15;

  // All lots for the current project
  const projectLots = lots.filter(lot => lot.projectId === project.id);

  // Unique key to force full leaflet component remount on structural switches if needed
  const mapKey = `leaflet-map-${project.id}`;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0a1220] border border-white/10 rounded-none overflow-hidden group select-none">
      
      {/* HUD Controller / Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-auto">
        <div className="bg-[#111c2e]/95 backdrop-blur-md px-3.5 py-2.5 border border-white/10 shadow-2xl flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS_COMMERCIAL[project.brand] }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-slate-100 font-sans">
              {project.name}
            </span>
          </div>
        </div>
      </div>

      {/* Primary React Leaflet Component Viewport */}
      <div className="w-full flex-1 min-h-0 relative z-0 grayscale-map">
        <MapContainer
          key={mapKey}
          center={centerCoord}
          zoom={defaultZoom}
          className="w-full h-full"
          zoomControl={false} // Disable default layout to construct cleaner styled controls
        >
          {/* Custom tile coordinates */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Map panning observer tool */}
          <MapUpdater center={centerCoord} zoom={defaultZoom} />

          {/* Synchronized lot coordinate tracker focus */}
          <SelectedLotUpdater selectedLot={selectedLot} />

          {/* Plot individual inventory land polygons */}
          {projectLots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const themeColor = lot.colorOverride || BRAND_COLORS_COMMERCIAL[project.brand];

            // Set coordinates list safely
            if (!lot.coordinates || lot.coordinates.length < 3) return null;

            return (
              <Polygon
                key={lot.id}
                positions={lot.coordinates}
                pathOptions={{
                  fillColor: themeColor,
                  fillOpacity: isSelected ? 0.45 : 0.25,
                  color: isSelected ? '#ffffff' : themeColor,
                  weight: isSelected ? 3.5 : 1.5,
                }}
                eventHandlers={{
                  click: () => {
                    onLotSelect(lot);
                  }
                }}
              >
                {/* Visual Tooltip Overlay centered right inside the parcel */}
                <Tooltip
                  permanent
                  direction="center"
                  className="lot-label-tooltip"
                >
                  <div className="flex flex-col items-center">
                    <span>{lot.labelText || lot.lotNumber}</span>
                    <span className="text-[7.5px] opacity-70 font-sans mt-0.5">{lot.areaSqm.toLocaleString()}㎡</span>
                  </div>
                </Tooltip>

                {/* Lightweight popup on click for instant summary */}
                <Popup>
                  <div className="p-1 max-w-[200px] text-slate-100 font-sans">
                    <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#D4AF37] border-b border-white/10 pb-1 mb-1.5 flex items-center justify-between">
                      <span>{lot.blockNumber} • {lot.lotNumber}</span>
                      <span className="text-[7px] px-1.5 py-0.5 rounded-none font-sans font-bold uppercase bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
                        Available
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-y-1 text-[9px] text-slate-300">
                      <div>Lot Area:</div>
                      <div className="text-right font-mono font-bold text-white">{lot.areaSqm.toLocaleString()} sqm</div>
                      <div>Price / SQM:</div>
                      <div className="text-right font-mono font-bold text-emerald-400">₱{lot.pricePerSqm.toLocaleString()}</div>
                      <div>Estimated TLP:</div>
                      <div className="text-right font-mono font-bold text-white">₱{(lot.areaSqm * lot.pricePerSqm).toLocaleString()}</div>
                      <div>Max FAR:</div>
                      <div className="text-right font-mono font-bold text-amber-500">FAR {lot.far}</div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>



    </div>
  );
};

export default InteractiveSDP;
