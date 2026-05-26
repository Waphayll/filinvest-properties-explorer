import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Tooltip, Popup, Marker, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { CommercialLot, CommercialProject } from '../types';
import { BRAND_COLORS_COMMERCIAL } from '../constants';
import { MapPin, Layers, Plus, Minus, Target } from 'lucide-react';


const CONCEPT_BOUNDS = L.latLngBounds([0, 0], [800, 1000]);
const CONCEPT_MAX_BOUNDS = L.latLngBounds([-100, -100], [900, 1100]);

// Custom gold pin marker icon for mobile selected lot
const selectedLotIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)">
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#D4AF37"/>
      <circle cx="14" cy="14" r="6" fill="#0a1220"/>
    </svg>
  </div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

// Easter Egg university icon for DLSU-D
const dlsuDIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)">
    <div style="background-color:#15803d; border: 2px solid #ffffff; border-radius: 9999px; padding: 6px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
      </svg>
    </div>
    <div style="background-color:#15803d; color:#ffffff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; margin-top:4px; white-space:nowrap; border: 1px solid #ffffff; box-shadow: 0 2px 4px rgb(0 0 0 / 0.2); font-family: sans-serif;">
      DLSU - Dasmariñas
    </div>
  </div>`,
  iconSize: [36, 50],
  iconAnchor: [18, 50],
});

interface InteractiveSDPProps {
  project: CommercialProject;
  lots: CommercialLot[];
  selectedLot: CommercialLot | null;
  onLotSelect: (lot: CommercialLot) => void;
  onLotDeselect?: () => void;
  onDlsuClick?: () => void;
  isEditMode?: boolean;
  easterEggEnabled?: boolean;
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
const SelectedLotUpdater: React.FC<{ selectedLot: CommercialLot | null; mapType?: 'actual' | 'concept' }> = ({ selectedLot, mapType = 'actual' }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLot) {
      if (mapType === 'actual' && selectedLot.coordinates) {
        const bounds = L.latLngBounds(selectedLot.coordinates as any);
        // Only zoom in on desktop/large screens (where md:flex-row is active)
        if (window.innerWidth >= 768) {
          map.flyToBounds(bounds, { padding: [50, 50], duration: 0.4 });
        }
      } else if (mapType === 'concept' && selectedLot.points) {
        // Calculate center of concept lot points
        const pairs = selectedLot.points.trim().split(/\s+/);
        const latlngs: [number, number][] = pairs.map(p => {
          const [x, y] = p.split(',').map(Number);
          return [800 - y, x];
        });
        if (latlngs.length > 0) {
          const bounds = L.latLngBounds(latlngs);
          const center = bounds.getCenter();
          // In desktop view, pan to center without zooming
          if (window.innerWidth >= 768) {
            map.panTo(center, { animate: true, duration: 0.4 });
          }
        }
      }
    }
  }, [selectedLot, map, mapType]);
  return null;
};

// MapClickHandler - deselects lot when tapping on empty map area
// Uses a shared ref to avoid deselecting when a polygon was just clicked
const MapClickHandler: React.FC<{ onDeselect?: () => void; polygonClickedRef: React.MutableRefObject<boolean> }> = ({ onDeselect, polygonClickedRef }) => {
  const map = useMap();
  useEffect(() => {
    if (!onDeselect) return;
    const handler = () => {
      if (polygonClickedRef.current) {
        polygonClickedRef.current = false;
        return;
      }
      onDeselect();
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, onDeselect, polygonClickedRef]);
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
          if (layer instanceof L.Polygon && (layer.options as any).lotId && ids.includes((layer.options as any).lotId)) {
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
          if (layer instanceof L.Polygon && (layer.options as any).lotId && ids.includes((layer.options as any).lotId)) {
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
          if (layer instanceof L.Polygon && (layer.options as any).lotId && ids.includes((layer.options as any).lotId)) {
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
  mapType?: 'actual' | 'concept';
}> = ({ isEditMode, adminSelectedIds, setAdminSelectedIds, svgUrl, setSvgUrl, svgScale, setSvgScale, svgRotation, setSvgRotation, svgOpacity, setSvgOpacity, svgLocked, setSvgLocked, mapType = 'actual' }) => {
  const map = useMap();
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);

  // Sync selected layers for Geoman drag mode
  useEffect(() => {
    if (!map) return;
    const selectedLayers: any[] = [];
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon && (layer.options as any).lotId && adminSelectedIds.includes((layer.options as any).lotId)) {
        selectedLayers.push(layer);
      }
    });

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon && (layer.options as any).lotId) {
        if (adminSelectedIds.includes((layer.options as any).lotId)) {
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
      if (layer instanceof L.Polygon && (layer.options as any).lotId) {
        const latlngs = layer.getLatLngs();
        let flatLatLngs: number[][] = [];
        if (Array.isArray(latlngs) && latlngs.length > 0) {
          if (Array.isArray(latlngs[0])) {
            flatLatLngs = latlngs[0].map((ll: any) => [ll.lat, ll.lng]);
          } else {
            flatLatLngs = latlngs.map((ll: any) => [ll.lat, ll.lng]);
          }
        }

        if (mapType === 'concept') {
          const pointsStr = flatLatLngs.map(ll => `${Math.round(ll[1])},${Math.round(800 - ll[0])}`).join(' ');
          exportedLots.push({
            id: (layer.options as any).lotId,
            points: pointsStr
          });
        } else {
          exportedLots.push({
            id: (layer.options as any).lotId,
            coordinates: flatLatLngs
          });
        }
      }
    });

    try {
      const endpoint = mapType === 'concept' ? '/api/save-concept-lots' : '/api/save-lots';
      const res = await fetch(endpoint, {
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
    <div className="absolute top-16 left-3 sm:left-14 z-[1000] pointer-events-auto w-56 sm:w-64">
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

// DlsuTouchMarker: wraps Marker with native DOM touch listeners for mobile long-press support
const DlsuTouchMarker: React.FC<{
  onDlsuClick?: () => void;
  onPressStart: () => void;
  onPressEnd: () => void;
}> = ({ onDlsuClick, onPressStart, onPressEnd }) => {
  const markerRef = React.useRef<L.Marker | null>(null);
  const touchStartTimeRef = React.useRef<number>(0);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const el = marker.getElement();
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // prevent scroll & context menu
      touchStartTimeRef.current = Date.now();
      onPressStart();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      onPressEnd();
      // If it was a short tap (< 500ms), also fire the click handler
      // so the 7-tap portfolio easter egg still works on mobile
      if (Date.now() - touchStartTimeRef.current < 500) {
        if (onDlsuClick) onDlsuClick();
      }
    };
    const handleContextMenu = (e: Event) => {
      e.preventDefault(); // block native long-press menu on mobile
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    el.addEventListener('contextmenu', handleContextMenu);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
      el.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onPressStart, onPressEnd, onDlsuClick]);

  return (
    <Marker
      ref={markerRef}
      position={[14.32422, 120.95754]}
      icon={dlsuDIcon}
      eventHandlers={{
        click: () => {
          if (onDlsuClick) onDlsuClick();
        },
        mousedown: onPressStart,
        mouseup: onPressEnd,
      }}
    />
  );
 };

interface MapControlsProps {
  mapType: 'actual' | 'concept';
  centerCoord?: [number, number];
  defaultZoom?: number;
  conceptBounds?: L.LatLngBounds;
  selectedLot?: any;
  projectLots: CommercialLot[];
}

const MapControls: React.FC<MapControlsProps> = ({
  mapType,
  centerCoord,
  defaultZoom,
  conceptBounds,
  selectedLot,
  projectLots,
}) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleCenter = () => {
    if (mapType === 'actual') {
      const allCoords = projectLots.flatMap(lot => lot.coordinates || []);
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { animate: true, padding: [40, 40] });
      } else if (centerCoord && defaultZoom !== undefined) {
        map.setView(centerCoord, defaultZoom, { animate: true });
      }
    } else if (mapType === 'concept') {
      const allPoints: [number, number][] = projectLots.flatMap(lot => {
        if (!lot.points) return [];
        return lot.points.trim().split(/\s+/).map(p => {
          const [x, y] = p.split(',').map(Number);
          return [800 - y, x];
        });
      });
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { animate: true, padding: [40, 40] });
      } else if (conceptBounds) {
        map.fitBounds(conceptBounds, { animate: true });
      }
    }
  };

  return (
    <div className={`absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-[1000] flex flex-col gap-2 pointer-events-auto ${selectedLot ? 'hidden md:flex' : 'flex'}`}>
      {/* Zoom In */}
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white/95 border border-[#171796]/10 text-[#171796] hover:bg-[#171796] hover:text-white active:bg-[#171796] flex items-center justify-center shadow-lg transition-all rounded-none hover:scale-105 cursor-pointer"
        title="Zoom In"
      >
        <Plus size={20} />
      </button>
      {/* Zoom Out */}
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white/95 border border-[#171796]/10 text-[#171796] hover:bg-[#171796] hover:text-white active:bg-[#171796] flex items-center justify-center shadow-lg transition-all rounded-none hover:scale-105 cursor-pointer"
        title="Zoom Out"
      >
        <Minus size={20} />
      </button>
      {/* Center Map */}
      <button
        onClick={handleCenter}
        className="w-10 h-10 bg-[#171796] hover:bg-blue-800 text-white flex items-center justify-center shadow-lg transition-all rounded-none hover:scale-105 cursor-pointer"
        title="Center Map"
      >
        <Target size={20} />
      </button>
    </div>
  );
};

const InteractiveSDP: React.FC<InteractiveSDPProps> = ({
  project,
  lots,
  selectedLot,
  onLotSelect,
  onLotDeselect,
  onDlsuClick,
  isEditMode = false,
  easterEggEnabled = true,
}) => {
  const [adminSelectedIds, setAdminSelectedIds] = React.useState<string[]>([]);
  const polygonClickedRef = React.useRef(false);

  // --- La Salle Easter Egg (long-press 5s: show image + play music from 10s mark) ---
  const [showLasalle, setShowLasalle] = React.useState(false);
  const lasalleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lasalleAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleDlsuPressStart = React.useCallback(() => {
    if (lasalleTimerRef.current) clearTimeout(lasalleTimerRef.current);

    lasalleTimerRef.current = setTimeout(() => {
      setShowLasalle(true);
      const audio = new Audio('/lasalle.mp3');
      audio.currentTime = 10; // skip to 10s mark
      audio.loop = true;
      audio.play().catch(() => {});
      lasalleAudioRef.current = audio;
    }, 5000); // 5 second hold
  }, []);

  const handleDlsuPressEnd = React.useCallback(() => {
    if (lasalleTimerRef.current) {
      clearTimeout(lasalleTimerRef.current);
      lasalleTimerRef.current = null;
    }
    // Stop audio & hide overlay
    if (lasalleAudioRef.current) {
      lasalleAudioRef.current.pause();
      lasalleAudioRef.current.currentTime = 0;
      lasalleAudioRef.current = null;
    }
    setShowLasalle(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lasalleTimerRef.current) clearTimeout(lasalleTimerRef.current);
      if (lasalleAudioRef.current) {
        lasalleAudioRef.current.pause();
        lasalleAudioRef.current = null;
      }
    };
  }, []);

  // Mapped center coordinate & zoom
  const centerCoord: [number, number] = project.center || [14.4150, 121.0360];
  const defaultZoom = project.zoom || 15;

  const [svgUrl, setSvgUrl] = React.useState<string | null>(null);
  const [svgPosition, setSvgPosition] = React.useState<[number, number]>(centerCoord);
  const [svgScale, setSvgScale] = React.useState<number>(1);
  const [svgRotation, setSvgRotation] = React.useState<number>(0);
  const [svgOpacity, setSvgOpacity] = React.useState<number>(0.5);
  const [svgLocked, setSvgLocked] = React.useState<boolean>(false);
  const [isConceptMapLoading, setIsConceptMapLoading] = React.useState<boolean>(true);

  const [viewMode, setViewMode] = React.useState<'actual' | 'concept'>('actual');

  useEffect(() => {
    if (viewMode === 'concept') {
      setIsConceptMapLoading(true);
    }
  }, [viewMode]);

  // Reset overlay when switching projects so it spawns at the new project's center
  useEffect(() => {
    setSvgUrl(null);
    setSvgPosition(centerCoord);
    setSvgScale(1);
    setSvgRotation(0);
    setSvgLocked(false);
    setIsConceptMapLoading(true);
  }, [project.id, project.conceptMapSvg]);

  // All lots for the current project
  const projectLots = lots.filter(lot => lot.projectId === project.id);

  // Track mobile screen size
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Unique key to force full leaflet component remount on structural switches if needed
  const mapKey = `leaflet-map-${project.id}`;

  const activeViewMode = (!project.conceptMapSvg) ? 'actual' : viewMode;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0a1220] border border-white/10 rounded-none overflow-hidden group select-none">
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="daang-hari-tint" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="-1 0 0 0 1   0 -1 0 0 1   0 0 -1 0 1   0 0 0 1 0" result="inverted" />
          <feColorMatrix in="inverted" type="matrix" values="1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0.333 0.333 0.333 0 0" />
        </filter>
      </svg>



      {/* HUD Controller / Header Overlay Removed */}

      {/* Map Toggle Controls - hidden on mobile when a lot is selected */}
      <div className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] pointer-events-auto ${selectedLot ? 'hidden md:block' : ''}`}>
        <div className="bg-white/95 backdrop-blur-md flex flex-col p-1 border border-[#171796]/10 rounded-none shadow-2xl shrink-0 gap-1">
          <button 
            onClick={() => setViewMode('actual')}
            className={`px-5 py-3 text-[11px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-start gap-3 w-40 ${activeViewMode === 'actual' ? 'bg-[#171796] text-white shadow-lg' : 'text-slate-500 hover:text-[#171796] hover:bg-[#171796]/5'}`}
          >
            <MapPin size={14} />
            Actual Map
          </button>
          {project.conceptMapSvg && (
            <button 
              onClick={() => setViewMode('concept')}
              className={`px-5 py-3 text-[11px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-start gap-3 w-40 ${activeViewMode === 'concept' ? 'bg-[#171796] text-white shadow-lg' : 'text-slate-500 hover:text-[#171796] hover:bg-[#171796]/5'}`}
            >
              <Layers size={14} />
              Concept Map
            </button>
          )}
        </div>
      </div>

      {/* Primary React Leaflet Component Viewport */}
      <div className={`w-full flex-1 min-h-0 relative z-0 ${activeViewMode === 'actual' ? 'light-theme-map' : 'grayscale-map'}`}>
        {activeViewMode === 'concept' && isConceptMapLoading && project.conceptMapSvg && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#171796]/10 border-t-[#171796] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#171796] font-sans text-xs font-bold uppercase tracking-widest animate-pulse">Loading Blueprint...</p>
            </div>
          </div>
        )}
        
        {activeViewMode === 'actual' ? (
          <MapContainer
            key={mapKey}
            center={centerCoord}
            zoom={defaultZoom}
            className="w-full h-full"
            zoomControl={false} // Disable default layout to construct cleaner styled controls
            attributionControl={false}
          >
            {/* Custom tile coordinates */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Map panning observer tool */}
            <MapUpdater center={centerCoord} zoom={defaultZoom} projectLots={projectLots} projectId={project.id} />

            {/* Synchronized lot coordinate tracker focus */}
            <SelectedLotUpdater selectedLot={selectedLot} mapType="actual" />

            {/* Easter Egg: DLSU - Dasmariñas Marker with native touch support */}
            {easterEggEnabled && project.id === 'daang-hari-lots' && (
              <DlsuTouchMarker
                onDlsuClick={onDlsuClick}
                onPressStart={handleDlsuPressStart}
                onPressEnd={handleDlsuPressEnd}
              />
            )}

            {/* Tap on empty map area to deselect */}
            <MapClickHandler onDeselect={onLotDeselect} polygonClickedRef={polygonClickedRef} />

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
              mapType="actual"
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
                  fillOpacity: (isSelected || isAdminSelected) ? 0.75 : 0.4,
                  color: themeColor,
                  weight: (isSelected || isAdminSelected) ? 4.5 : 1.5,
                  dashArray: isAdminSelected ? '5, 5' : undefined,
                  // @ts-ignore - injecting custom option
                  lotId: lot.id,
                  // @ts-ignore - force geoman to recognize
                  pmIgnore: false
                }}
                eventHandlers={{
                  click: (e) => {
                    polygonClickedRef.current = true;
                    if (!isEditMode) {
                      onLotSelect(lot);
                    } else if ((e.originalEvent as MouseEvent).shiftKey) {
                      setAdminSelectedIds(prev =>
                        prev.includes(lot.id) ? prev.filter(id => id !== lot.id) : [...prev, lot.id]
                      );
                    }
                  },
                  mouseover: (e) => {
                    const layer = e.target;
                    if (!isSelected && !isAdminSelected) {
                      layer.setStyle({ fillOpacity: 0.7, weight: 2.5, color: themeColor });
                    }
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    if (!isSelected && !isAdminSelected) {
                      layer.setStyle({ fillOpacity: 0.4, weight: 1.5, color: themeColor });
                    }
                  }
                }}
              >
                <Tooltip 
                  key={`tooltip-${lot.id}-perm`} 
                  direction="center" 
                  permanent={true}
                  className="lot-label-tooltip"
                >
                  {lot.labelText || lot.lotNumber}
                </Tooltip>
              </Polygon>
            );
          })}

          <MapControls
            mapType="actual"
            centerCoord={centerCoord}
            defaultZoom={defaultZoom}
            selectedLot={selectedLot}
            projectLots={projectLots}
          />
        </MapContainer>
        ) : (
          <MapContainer
            key={`${mapKey}-concept`}
            crs={L.CRS.Simple}
            bounds={project.id === 'filinvest-city' ? CONCEPT_BOUNDS : L.latLngBounds([-200, -250], [1000, 1250])}
            maxBounds={project.id === 'filinvest-city' ? CONCEPT_MAX_BOUNDS : L.latLngBounds([-300, -375], [1100, 1375])}
            maxBoundsViscosity={1.0}
            minZoom={project.id === 'filinvest-city' ? 1 : 0.5}
            maxZoom={2}
            zoomSnap={0.5}
            zoomDelta={0.5}
            zoomControl={false}
            attributionControl={false}
            className="w-full h-full bg-[#0a1220] z-0"
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-[-1]"></div>
            
            {project.conceptMapSvg && (
              <ImageOverlay 
                url={project.conceptMapSvg} 
                bounds={CONCEPT_BOUNDS}
                opacity={0.95}
                className={(project.id === 'daang-hari-lots' || project.id === 'filinvest-city') ? 'invert-concept-map' : ''}
                eventHandlers={{
                  load: () => setIsConceptMapLoading(false),
                  error: () => setIsConceptMapLoading(false)
                }}
              />
            )}

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
              mapType="concept"
            />
            
            <SelectedLotUpdater selectedLot={selectedLot} mapType="concept" />
            <MapClickHandler onDeselect={onLotDeselect} polygonClickedRef={polygonClickedRef} />

            {projectLots.map(lot => {
              if (!lot.points) return null;
              
              const isSelected = selectedLot?.id === lot.id;
              const isAdminSelected = isEditMode && adminSelectedIds.includes(lot.id);
              const themeColor = lot.colorOverride || BRAND_COLORS_COMMERCIAL[project.brand];
              
              // Map SVG points string "x,y" to Leaflet LatLng [800-y, x]
              const pairs = lot.points.trim().split(/\s+/);
              const latlngs: [number, number][] = pairs.map(p => {
                const [x, y] = p.split(',').map(Number);
                return [800 - y, x];
              });

              return (
                <Polygon
                  key={lot.id}
                  positions={latlngs}
                  smoothFactor={0}
                  pathOptions={{
                    fillColor: isAdminSelected ? '#fb7185' : themeColor,
                  fillOpacity: (isSelected || isAdminSelected) ? 0.75 : 0.4,
                  color: themeColor,
                  weight: (isSelected || isAdminSelected) ? 4.5 : 1.5,
                  dashArray: isAdminSelected ? '5, 5' : undefined,
                  // @ts-ignore
                  lotId: lot.id,
                  // @ts-ignore
                  pmIgnore: false
                }}
                eventHandlers={{
                  click: (e) => {
                    polygonClickedRef.current = true;
                    if (!isEditMode) {
                      onLotSelect(lot);
                    } else if ((e.originalEvent as MouseEvent).shiftKey) {
                      setAdminSelectedIds(prev =>
                        prev.includes(lot.id) ? prev.filter(id => id !== lot.id) : [...prev, lot.id]
                      );
                    }
                  },
                  mouseover: (e) => {
                    const layer = e.target;
                    if (!isSelected && !isAdminSelected) {
                      layer.setStyle({ fillOpacity: 0.7, weight: 2.5, color: themeColor });
                    }
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    if (!isSelected && !isAdminSelected) {
                      layer.setStyle({ fillOpacity: 0.4, weight: 1.5, color: themeColor });
                    }
                  }
                }}
                >
                  <Tooltip 
                    key={`tooltip-${lot.id}-perm`} 
                    direction="center" 
                    permanent={true}
                    className="lot-label-tooltip"
                  >
                    {lot.labelText || lot.lotNumber}
                  </Tooltip>
                </Polygon>
              );
            })}

            <MapControls
              mapType="concept"
              conceptBounds={project.id === 'filinvest-city' ? CONCEPT_BOUNDS : L.latLngBounds([-200, -250], [1000, 1250])}
              selectedLot={selectedLot}
              projectLots={projectLots}
            />
          </MapContainer>
        )}
      </div>

      {/* La Salle Easter Egg Fullscreen Overlay */}
      {showLasalle && (
        <div
          className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
          onMouseUp={handleDlsuPressEnd}
          onTouchEnd={handleDlsuPressEnd}
        >
          <img
            src="/lasalle.jpg"
            alt="La Salle"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />
        </div>
      )}

    </div>
  );
};

export default InteractiveSDP;
