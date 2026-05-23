import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Tooltip, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { CommercialLot, CommercialProject } from '../types';
import { BRAND_COLORS_COMMERCIAL } from '../constants';


interface InteractiveSDPProps {
  project: CommercialProject;
  lots: CommercialLot[];
  selectedLot: CommercialLot | null;
  onLotSelect: (lot: CommercialLot) => void;
  isEditMode?: boolean;
}

// MapUpdater helper component to smoothly update views when projects are switched in the parent tab switcher
const MapUpdater: React.FC<{ center: [number, number]; zoom: number; projectLots: CommercialLot[]; projectId: string }> = ({ center, zoom, projectLots, projectId }) => {
  const map = useMap();
  useEffect(() => {
    if (projectLots.length > 0) {
      const bounds = L.latLngBounds([]);
      projectLots.forEach(lot => {
        if (lot.coordinates && Array.isArray(lot.coordinates)) {
          lot.coordinates.forEach(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              bounds.extend([coord[0], coord[1]] as L.LatLngTuple);
            }
          });
        }
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 0.8 });
      } else {
        map.setView(center, zoom, { animate: true, duration: 0.8 });
      }
    } else {
      map.setView(center, zoom, { animate: true, duration: 0.8 });
    }
  }, [center, zoom, projectId, map]);
  return null;
};

// SelectedLotUpdater helper to pan map when a specific lot is selected via sidebar list click
const SelectedLotUpdater: React.FC<{ selectedLot: CommercialLot | null }> = ({ selectedLot }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLot?.coordinates && selectedLot.coordinates.length > 0) {
      const bounds = L.latLngBounds([]);
      selectedLot.coordinates.forEach(coord => {
        if (Array.isArray(coord) && coord.length >= 2) {
          bounds.extend([coord[0], coord[1]] as L.LatLngTuple);
        }
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [100, 100], maxZoom: 19, animate: true, duration: 0.6 });
      }
    }
  }, [selectedLot, map]);
  return null;
};

// Geoman Setup Component
const GeomanSetup: React.FC<{ isEditMode?: boolean, adminSelectedIds: string[] }> = ({ isEditMode, adminSelectedIds }) => {
  const map = useMap();
  const adminSelectedIdsRef = React.useRef(adminSelectedIds);

  useEffect(() => {
    adminSelectedIdsRef.current = adminSelectedIds;
  }, [adminSelectedIds]);

  useEffect(() => {
    if (isEditMode) {
      map.pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawPolygon: true,
        drawCircle: false,
        drawText: false,
        editMode: true,
        dragMode: true,
        cutPolygon: false,
        removalMode: true,
        rotateMode: true,
        scaleMode: true,
      });

      const transformSelected = (scaleX: number, scaleY: number) => {
        const ids = adminSelectedIdsRef.current;
        if (ids.length === 0) return;

        map.eachLayer((layer: any) => {
          if (layer instanceof L.Polygon && layer.options.lotId && ids.includes(layer.options.lotId)) {
            const latlngs = layer.getLatLngs() as any;
            let flatLatLngs: L.LatLng[] = [];
            if (Array.isArray(latlngs) && latlngs.length > 0) {
              if (Array.isArray(latlngs[0])) flatLatLngs = latlngs[0];
              else flatLatLngs = latlngs;
            }
            if (flatLatLngs.length === 0) return;

            let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
            flatLatLngs.forEach(ll => {
              if (ll.lat < minLat) minLat = ll.lat;
              if (ll.lat > maxLat) maxLat = ll.lat;
              if (ll.lng < minLng) minLng = ll.lng;
              if (ll.lng > maxLng) maxLng = ll.lng;
            });
            const centerLat = (minLat + maxLat) / 2;
            const centerLng = (minLng + maxLng) / 2;

            const newLatLngs = flatLatLngs.map(ll => {
              const dLat = ll.lat - centerLat;
              const dLng = ll.lng - centerLng;
              return L.latLng(centerLat + dLat * scaleY, centerLng + dLng * scaleX);
            });

            if (Array.isArray(latlngs) && latlngs.length > 0 && Array.isArray(latlngs[0])) {
              layer.setLatLngs([newLatLngs]);
            } else {
              layer.setLatLngs(newLatLngs);
            }
          }
        });
      };

      const rotateSelected = (angleDegrees: number) => {
        const ids = adminSelectedIdsRef.current;
        if (ids.length === 0) return;

        const angleRads = (angleDegrees * Math.PI) / 180;
        const cosAngle = Math.cos(angleRads);
        const sinAngle = Math.sin(angleRads);

        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;

        map.eachLayer((layer: any) => {
          if (layer instanceof L.Polygon && layer.options.lotId && ids.includes(layer.options.lotId)) {
            const latlngs = layer.getLatLngs() as any;
            let flatLatLngs: L.LatLng[] = [];
            if (Array.isArray(latlngs) && latlngs.length > 0) {
              if (Array.isArray(latlngs[0])) flatLatLngs = latlngs[0];
              else flatLatLngs = latlngs;
            }
            flatLatLngs.forEach(ll => {
              if (ll.lat < minLat) minLat = ll.lat;
              if (ll.lat > maxLat) maxLat = ll.lat;
              if (ll.lng < minLng) minLng = ll.lng;
              if (ll.lng > maxLng) maxLng = ll.lng;
            });
          }
        });

        if (minLat === Infinity) return;

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latCos = Math.cos((centerLat * Math.PI) / 180);

        map.eachLayer((layer: any) => {
          if (layer instanceof L.Polygon && layer.options.lotId && ids.includes(layer.options.lotId)) {
            const latlngs = layer.getLatLngs() as any;
            let flatLatLngs: L.LatLng[] = [];
            if (Array.isArray(latlngs) && latlngs.length > 0) {
              if (Array.isArray(latlngs[0])) flatLatLngs = latlngs[0];
              else flatLatLngs = latlngs;
            }

            const newLatLngs = flatLatLngs.map(ll => {
              const dx = (ll.lng - centerLng) * latCos;
              const dy = ll.lat - centerLat;

              const rx = dx * cosAngle - dy * sinAngle;
              const ry = dx * sinAngle + dy * cosAngle;

              return L.latLng(centerLat + ry, centerLng + rx / latCos);
            });

            if (Array.isArray(latlngs) && latlngs.length > 0 && Array.isArray(latlngs[0])) {
              layer.setLatLngs([newLatLngs]);
            } else {
              layer.setLatLngs(newLatLngs);
            }
          }
        });
      };

      // Ensure we don't duplicate custom controls if re-rendering without removing
      if (map.pm.Toolbar.getControlOrder().indexOf('ScaleUp') === -1) {
        map.pm.Toolbar.createCustomControl({
          name: 'ScaleUp',
          block: 'edit',
          title: 'Scale Up (+5%)',
          className: 'geoman-scale-up',
          onClick: () => transformSelected(1.05, 1.05),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'ScaleDown',
          block: 'edit',
          title: 'Scale Down (-5%)',
          className: 'geoman-scale-down',
          onClick: () => transformSelected(0.95, 0.95),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'StretchX',
          block: 'edit',
          title: 'Stretch X',
          className: 'geoman-stretch-x',
          onClick: () => transformSelected(1.05, 1),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'StretchY',
          block: 'edit',
          title: 'Stretch Y',
          className: 'geoman-stretch-y',
          onClick: () => transformSelected(1, 1.05),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'RotateLeftFast',
          block: 'edit',
          title: 'Rotate Left (-15°)',
          className: 'geoman-rotate-left-fast',
          onClick: () => rotateSelected(-15),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'RotateRightFast',
          block: 'edit',
          title: 'Rotate Right (+15°)',
          className: 'geoman-rotate-right-fast',
          onClick: () => rotateSelected(15),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'RotateLeft',
          block: 'edit',
          title: 'Rotate Left (-1°)',
          className: 'geoman-rotate-left',
          onClick: () => rotateSelected(-1),
          toggle: false,
        });
        map.pm.Toolbar.createCustomControl({
          name: 'RotateRight',
          block: 'edit',
          title: 'Rotate Right (+1°)',
          className: 'geoman-rotate-right',
          onClick: () => rotateSelected(1),
          toggle: false,
        });
      }

    } else {
      map.pm.removeControls();
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
    }
  }, [isEditMode, map]);
  return null;
};

// SVG Overlay Manager Component
const SVGOverlayManager: React.FC<{
  svgUrl: string | null;
  svgPosition: [number, number];
  svgScale: number;
  svgRotation: number;
  svgOpacity: number;
  svgLocked: boolean;
  setSvgPosition: (pos: [number, number]) => void;
}> = ({ svgUrl, svgPosition, svgScale, svgRotation, svgOpacity, svgLocked, setSvgPosition }) => {
  const map = useMap();
  const [zoom, setZoom] = React.useState(map.getZoom());
  const initialZoomRef = React.useRef(map.getZoom());

  useEffect(() => {
    if (!map.getPane('blueprintPane')) {
      map.createPane('blueprintPane');
      map.getPane('blueprintPane')!.style.zIndex = '350'; // Below overlayPane (polygons) which is 400
    }
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoom', handleZoom);
    return () => { map.off('zoom', handleZoom); };
  }, [map]);

  if (!svgUrl) return null;

  // Calculate zoom scale factor: 2^(currentZoom - initialZoom)
  const zoomFactor = Math.pow(2, zoom - initialZoomRef.current);
  const finalScale = svgScale * zoomFactor;

  const icon = L.divIcon({
    html: `
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%) scale(${finalScale}) rotate(${svgRotation}deg);
        transform-origin: center center;
        pointer-events: ${svgLocked ? 'none' : 'auto'};
        cursor: ${svgLocked ? 'default' : 'move'};
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <img src="${svgUrl}" style="
          opacity: ${svgOpacity};
          max-width: none !important;
          max-height: none !important;
          width: auto !important;
          height: auto !important;
          display: block;
          min-width: 100px;
          min-height: 100px;
        " alt="Overlay" />
      </div>
    `,
    className: 'svg-overlay-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  return (
    <Marker
      position={svgPosition}
      draggable={!svgLocked}
      pane="blueprintPane"
      zIndexOffset={-1000}
      icon={icon}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setSvgPosition([pos.lat, pos.lng]);
        }
      }}
    />
  );
};

// Export Admin Panel Component
const ExportAdminPanel: React.FC<{
  isEditMode?: boolean;
  adminSelectedIds: string[];
  setAdminSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  svgUrl: string | null;
  setSvgUrl: React.Dispatch<React.SetStateAction<string | null>>;
  svgScale: number;
  setSvgScale: React.Dispatch<React.SetStateAction<number>>;
  svgRotation: number;
  setSvgRotation: React.Dispatch<React.SetStateAction<number>>;
  svgOpacity: number;
  setSvgOpacity: React.Dispatch<React.SetStateAction<number>>;
  svgLocked: boolean;
  setSvgLocked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isEditMode, adminSelectedIds, setAdminSelectedIds, svgUrl, setSvgUrl, svgScale, setSvgScale, svgRotation, setSvgRotation, svgOpacity, setSvgOpacity, svgLocked, setSvgLocked }) => {
  const map = useMap();
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);

  // Sync selected layers for Geoman drag mode
  useEffect(() => {
    if (!map) return;
    const selectedLayers: any[] = [];
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon && layer.options.lotId && adminSelectedIds.includes(layer.options.lotId)) {
        selectedLayers.push(layer);
      }
    });

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon && layer.options.lotId) {
        if (adminSelectedIds.includes(layer.options.lotId)) {
          layer.pm.setOptions({ syncLayersOnDrag: selectedLayers.filter(l => l !== layer) });
        } else {
          layer.pm.setOptions({ syncLayersOnDrag: false });
        }
      }
    });
  }, [adminSelectedIds, map]);

  if (!isEditMode) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSvgUrl(url);
    }
  };

  const handleExport = async () => {
    setSaveStatus('Saving...');
    const exportedLots: any[] = [];
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon && layer.options.lotId) {
        const latlngs = layer.getLatLngs();
        let flatLatLngs: number[][] = [];
        if (Array.isArray(latlngs) && latlngs.length > 0) {
          if (Array.isArray(latlngs[0])) {
            flatLatLngs = latlngs[0].map((ll: any) => [ll.lat, ll.lng]);
          } else {
            flatLatLngs = latlngs.map((ll: any) => [ll.lat, ll.lng]);
          }
        }

        exportedLots.push({
          id: layer.options.lotId,
          coordinates: flatLatLngs
        });
      }
    });

    try {
      const res = await fetch('/api/save-lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportedLots)
      });
      if (res.ok) {
        setSaveStatus('Saved Successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('Error saving data');
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('Failed to connect to Vite API');
    }
  };

  return (
    <div className="absolute top-16 left-14 z-[1000] pointer-events-auto w-64">
      <div className="bg-[#111c2e]/95 backdrop-blur-md p-3 border border-indigo-500/50 shadow-2xl flex flex-col gap-2">
        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex justify-between items-center">
          <span>Admin Controls</span>
          <button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[8px] shadow">
            Save to Codebase
          </button>
        </div>
        <p className="text-[9px] text-slate-400 leading-tight">Shift+Click to select multiple plots. Use the Geoman toolbar on the left to Drag, Rotate, and Scale.</p>

        <div className="mt-1 flex flex-col gap-1 border-t border-indigo-500/30 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-slate-300">Selected: {adminSelectedIds.length}</span>
            {adminSelectedIds.length > 0 && (
              <button onClick={() => setAdminSelectedIds([])} className="text-[8px] text-rose-400 hover:text-rose-300">Clear Selection</button>
            )}
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-1 border-t border-indigo-500/30 pt-2">
          <div className="text-[10px] font-bold text-indigo-400 mb-1">Overlay Blueprint</div>
          {!svgUrl ? (
            <input type="file" accept=".svg,.png,.jpg,.jpeg" onChange={handleFileUpload} className="text-[9px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:bg-indigo-600 file:text-white" />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-1">
                <span className="text-[9px] text-slate-300 w-10">Scale</span>
                <input type="range" min="0.001" max="5" step="0.001" value={svgScale} onChange={(e) => setSvgScale(parseFloat(e.target.value))} className="w-16" />
                <input type="number" min="0.001" step="0.001" value={svgScale} onChange={(e) => setSvgScale(parseFloat(e.target.value) || 1)} className="w-12 text-[8px] bg-slate-800 text-white rounded border border-slate-600 px-1 py-0.5" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-300">Rotate</span>
                <input type="range" min="-180" max="180" step="1" value={svgRotation} onChange={(e) => setSvgRotation(parseFloat(e.target.value))} className="w-24" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-300">Opacity</span>
                <input type="range" min="0" max="1" step="0.05" value={svgOpacity} onChange={(e) => setSvgOpacity(parseFloat(e.target.value))} className="w-24" />
              </div>
              <div className="flex justify-between items-center mt-1 pt-2 border-t border-indigo-500/30">
                <button onClick={() => setSvgLocked(!svgLocked)} className={`text-[8px] px-2 py-1 rounded border shadow-sm ${svgLocked ? 'bg-rose-500/20 border-rose-400 text-rose-300 hover:bg-rose-500/30' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                  {svgLocked ? '🔒 Overlay Locked' : '🔓 Overlay Unlocked'}
                </button>
                <button onClick={() => setSvgUrl(null)} className="text-[8px] text-rose-400 hover:text-rose-300">Remove Overlay</button>
              </div>
            </div>
          )}
        </div>

        {saveStatus && (
          <div className={`text-[9px] font-bold mt-1 ${saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {saveStatus}
          </div>
        )}
      </div>
    </div>
  );
};

const InteractiveSDP: React.FC<InteractiveSDPProps> = ({
  project,
  lots,
  selectedLot,
  onLotSelect,
  isEditMode = false,
}) => {
  const [adminSelectedIds, setAdminSelectedIds] = React.useState<string[]>([]);
  // Mapped center coordinate & zoom
  const centerCoord: [number, number] = project.center || [14.4150, 121.0360];
  const defaultZoom = project.zoom || 15;

  const [svgUrl, setSvgUrl] = React.useState<string | null>(null);
  const [svgPosition, setSvgPosition] = React.useState<[number, number]>(centerCoord);
  const [svgScale, setSvgScale] = React.useState<number>(1);
  const [svgRotation, setSvgRotation] = React.useState<number>(0);
  const [svgOpacity, setSvgOpacity] = React.useState<number>(0.5);
  const [svgLocked, setSvgLocked] = React.useState<boolean>(false);

  // Reset overlay when switching projects so it spawns at the new project's center
  useEffect(() => {
    setSvgUrl(null);
    setSvgPosition(centerCoord);
    setSvgScale(1);
    setSvgRotation(0);
    setSvgLocked(false);
  }, [project.id]);

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
          <MapUpdater center={centerCoord} zoom={defaultZoom} projectLots={projectLots} projectId={project.id} />

          {/* Synchronized lot coordinate tracker focus */}
          <SelectedLotUpdater selectedLot={selectedLot} />

          {/* Editing Controls & Admin Panel */}
          <GeomanSetup isEditMode={isEditMode} adminSelectedIds={adminSelectedIds} />
          <ExportAdminPanel
            isEditMode={isEditMode}
            adminSelectedIds={adminSelectedIds}
            setAdminSelectedIds={setAdminSelectedIds}
            svgUrl={svgUrl} setSvgUrl={setSvgUrl}
            svgScale={svgScale} setSvgScale={setSvgScale}
            svgRotation={svgRotation} setSvgRotation={setSvgRotation}
            svgOpacity={svgOpacity} setSvgOpacity={setSvgOpacity}
            svgLocked={svgLocked} setSvgLocked={setSvgLocked}
          />
          <SVGOverlayManager
            svgUrl={svgUrl}
            svgPosition={svgPosition}
            svgScale={svgScale}
            svgRotation={svgRotation}
            svgOpacity={svgOpacity}
            svgLocked={svgLocked}
            setSvgPosition={setSvgPosition}
          />

          {/* Plot individual inventory land polygons */}
          {projectLots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const isAdminSelected = isEditMode && adminSelectedIds.includes(lot.id);
            const themeColor = lot.colorOverride || BRAND_COLORS_COMMERCIAL[project.brand];

            // Set coordinates list safely
            if (!lot.coordinates || lot.coordinates.length < 3) return null;

            return (
              <Polygon
                key={lot.id}
                positions={lot.coordinates}
                pathOptions={{
                  fillColor: isAdminSelected ? '#fb7185' : themeColor, // rose-400 for admin selection
                  fillOpacity: (isSelected || isAdminSelected) ? 0.45 : 0.25,
                  color: (isSelected || isAdminSelected) ? '#ffffff' : themeColor,
                  weight: (isSelected || isAdminSelected) ? 3.5 : 1.5,
                  dashArray: isAdminSelected ? '5, 5' : undefined,
                  // @ts-ignore - injecting custom option
                  lotId: lot.id,
                  // @ts-ignore - force geoman to recognize
                  pmIgnore: false
                }}
                eventHandlers={{
                  click: (e) => {
                    if (!isEditMode) {
                      onLotSelect(lot);
                    } else if ((e.originalEvent as MouseEvent).shiftKey) {
                      setAdminSelectedIds(prev =>
                        prev.includes(lot.id) ? prev.filter(id => id !== lot.id) : [...prev, lot.id]
                      );
                    }
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
