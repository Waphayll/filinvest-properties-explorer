import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CommercialLot, CommercialProject } from '../types';
import { BRAND_COLORS_COMMERCIAL } from '../constants';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Layers, Sparkles, SlidersHorizontal, Eye, Info } from 'lucide-react';

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
  const [filterType, setFilterType] = useState<'all' | 'available' | 'high_far' | 'premium_size'>('all');
  const [showZonalLegend, setShowZonalLegend] = useState<boolean>(true);

  // Mapped center coordinate & zoom
  const centerCoord: [number, number] = project.center || [14.4150, 121.0360];
  const defaultZoom = project.zoom || 15;

  // Filter lots according to interactive ledger query pills
  const filteredLots = lots.filter(lot => {
    if (lot.projectId !== project.id) return false;
    if (filterType === 'available') return lot.status === 'Available';
    if (filterType === 'high_far') return lot.far >= 10;
    if (filterType === 'premium_size') return lot.areaSqm >= 2000;
    return true;
  });

  // Unique key to force full leaflet component remount on structural switches if needed
  const mapKey = `leaflet-map-${project.id}`;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0a1220] border border-white/10 rounded-none overflow-hidden group select-none">
      
      {/* HUD Controller / Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col sm:flex-row sm:items-center gap-2 max-w-[calc(100%-24px)] pointer-events-auto">
        <div className="bg-[#111c2e]/95 backdrop-blur-md px-3.5 py-2.5 border border-white/10 shadow-2xl flex items-center gap-3 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS_COMMERCIAL[project.brand] }} />
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-slate-100 font-sans">
                {project.name}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
              Property Registry Mapping
            </span>
          </div>
        </div>

        {/* Filter Controls Widget overlay */}
        <div className="flex flex-wrap gap-1 bg-[#111c2e]/95 backdrop-blur border border-white/10 p-1 shadow-2xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#D4AF37] text-slate-950 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            All Lots ({lots.filter(l => l.projectId === project.id).length})
          </button>
          <button
            onClick={() => setFilterType('available')}
            className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              filterType === 'available'
                ? 'bg-[#34D399] text-slate-950 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Available ({lots.filter(l => l.projectId === project.id && l.status === 'Available').length})
          </button>
          <button
            onClick={() => setFilterType('high_far')}
            className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              filterType === 'high_far'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            High FAR (FAR 10+)
          </button>
          <button
            onClick={() => setFilterType('premium_size')}
            className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              filterType === 'premium_size'
                ? 'bg-purple-500 text-slate-950 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            2,000+ SQM
          </button>
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
          {filteredLots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const isAvailable = lot.status === 'Available';
            const themeColor = BRAND_COLORS_COMMERCIAL[project.brand];

            // Render style matching availability + hover states
            const fillColour = isAvailable
              ? (isSelected ? themeColor : `${themeColor}`)
              : '#334155'; // Dark blue-slate for reserved

            const outlineColour = isSelected
              ? '#ffffff'
              : (isAvailable ? themeColor : '#475569');

            // Set coordinates list safely
            if (!lot.coordinates || lot.coordinates.length < 3) return null;

            return (
              <Polygon
                key={lot.id}
                positions={lot.coordinates}
                pathOptions={{
                  fillColor: fillColour,
                  fillOpacity: isSelected ? 0.38 : (isAvailable ? 0.15 : 0.06),
                  color: outlineColour,
                  weight: isSelected ? 3.5 : 1.5,
                  dashArray: isAvailable ? undefined : '4, 4',
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
                  className={isAvailable ? 'lot-label-tooltip' : 'lot-label-tooltip-reserved'}
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
                      <span className={`text-[7px] px-1.5 py-0.5 rounded-none font-sans font-bold uppercase ${isAvailable ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400'}`}>
                        {lot.status}
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

      {/* Floating Interactive Zonal Info Overlay (Bottom-Left) */}
      {showZonalLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-[#111c2e]/95 backdrop-blur-md p-3 border border-white/10 shadow-2xl max-w-[260px] hidden sm:block">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span className="text-[9px] font-sans font-black tracking-[0.2em] text-[#D4AF37] uppercase flex items-center gap-1">
              <Sparkles size={11} /> INDEX & METADATA
            </span>
            <button
              onClick={() => setShowZonalLegend(false)}
              className="text-slate-400 hover:text-white text-[8px] uppercase tracking-wider font-bold"
            >
              Hide
            </button>
          </div>
          <div className="flex flex-col gap-1.5 text-[8.5px] text-slate-300">
            <p className="leading-relaxed font-sans">
              Currently visualizing <strong className="text-white uppercase font-sans font-semibold">{project.name}</strong> inventory. All values plotted on OpenStreetMap accurately matching district coordinate bounds.
            </p>
            <div className="h-[1px] bg-white/5 my-0.5" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2" style={{ backgroundColor: `${BRAND_COLORS_COMMERCIAL[project.brand]}` }} />
              <span>Available Commercial Portions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-600 border border-slate-500 border-dashed" />
              <span>Reserved/Leased Land Lots</span>
            </div>
          </div>
        </div>
      )}

      {/* Closed Legend Reveal */}
      {!showZonalLegend && (
        <button
          onClick={() => setShowZonalLegend(true)}
          className="absolute bottom-3 left-3 z-[1000] bg-[#111c2e]/95 hover:bg-[#1b2b48] backdrop-blur-md px-2.5 py-1.5 border border-white/10 text-[8px] font-sans font-black tracking-widest text-[#D4AF37] uppercase shadow-2xl flex items-center gap-1 cursor-pointer transition-all"
        >
          <Info size={11} /> SHOW MAP DETAILS
        </button>
      )}

      {/* User Controls Help overlay (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#111c2e]/95 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[8px] uppercase tracking-[0.15em] text-slate-400 hidden sm:flex items-center gap-1.5 shadow-xl">
        <MapPin size={10} className="text-[#D4AF37]" />
        <span>Click parcel polygon for full ledger detail & calculator sync</span>
      </div>

    </div>
  );
};

export default InteractiveSDP;
