import React, { useState, useEffect, useCallback } from 'react';
import { Palette, RotateCcw, ChevronDown, ChevronUp, Save, Pipette } from 'lucide-react';

// ─── Default theme colors matching the editorial aesthetic ───
export interface SiteTheme {
  primaryBg: string;       // #0a1220 - deepest background
  secondaryBg: string;     // #111c2e - panels, cards, header
  sidebarBg: string;       // #0c1524 - lot details sidebar
  accent: string;          // #D4AF37 - gold accent
  accentHover: string;     // #f59e0b - amber hover states
  textPrimary: string;     // #f1f5f9 - slate-100
  textSecondary: string;   // #94a3b8 - slate-400
  borderColor: string;     // rgba(255,255,255,0.1)
  headerBg: string;        // #111c2e at 95% opacity
}

export const DEFAULT_THEME: SiteTheme = {
  primaryBg: '#0a1220',
  secondaryBg: '#111c2e',
  sidebarBg: '#0c1524',
  accent: '#D4AF37',
  accentHover: '#f59e0b',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  borderColor: '#1e293b',
  headerBg: '#111c2e',
};

const THEME_STORAGE_KEY = 'filinvest_site_theme';

// Preset palettes for one-click theming
const PRESETS: { name: string; theme: Partial<SiteTheme> }[] = [
  {
    name: 'Default Editorial',
    theme: { ...DEFAULT_THEME },
  },
  {
    name: 'Midnight Emerald',
    theme: {
      primaryBg: '#0a1a14',
      secondaryBg: '#0f2920',
      sidebarBg: '#0c1f18',
      accent: '#34d399',
      accentHover: '#6ee7b7',
      textPrimary: '#ecfdf5',
      textSecondary: '#6ee7b7',
      borderColor: '#1a3a2e',
      headerBg: '#0f2920',
    },
  },
  {
    name: 'Royal Sapphire',
    theme: {
      primaryBg: '#0c0f1f',
      secondaryBg: '#141a3a',
      sidebarBg: '#0e1230',
      accent: '#818cf8',
      accentHover: '#a5b4fc',
      textPrimary: '#e0e7ff',
      textSecondary: '#93a3d4',
      borderColor: '#1e2560',
      headerBg: '#141a3a',
    },
  },
  {
    name: 'Obsidian Rose',
    theme: {
      primaryBg: '#1a0a10',
      secondaryBg: '#2a1220',
      sidebarBg: '#1f0c16',
      accent: '#f472b6',
      accentHover: '#fb7185',
      textPrimary: '#fce7f3',
      textSecondary: '#d4a0b9',
      borderColor: '#3d1a2e',
      headerBg: '#2a1220',
    },
  },
  {
    name: 'Arctic Frost',
    theme: {
      primaryBg: '#0f172a',
      secondaryBg: '#1e293b',
      sidebarBg: '#0f172a',
      accent: '#38bdf8',
      accentHover: '#7dd3fc',
      textPrimary: '#f0f9ff',
      textSecondary: '#7dd3fc',
      borderColor: '#1e3a5f',
      headerBg: '#1e293b',
    },
  },
  {
    name: 'Warm Slate',
    theme: {
      primaryBg: '#1c1917',
      secondaryBg: '#292524',
      sidebarBg: '#1c1917',
      accent: '#fbbf24',
      accentHover: '#fcd34d',
      textPrimary: '#fafaf9',
      textSecondary: '#a8a29e',
      borderColor: '#44403c',
      headerBg: '#292524',
    },
  },
];

// Color channel labels with grouping
const COLOR_FIELDS: { key: keyof SiteTheme; label: string; group: string }[] = [
  { key: 'primaryBg', label: 'Primary Background', group: 'Backgrounds' },
  { key: 'secondaryBg', label: 'Secondary Background', group: 'Backgrounds' },
  { key: 'sidebarBg', label: 'Sidebar Background', group: 'Backgrounds' },
  { key: 'headerBg', label: 'Header Background', group: 'Backgrounds' },
  { key: 'accent', label: 'Accent Color', group: 'Accents' },
  { key: 'accentHover', label: 'Accent Hover', group: 'Accents' },
  { key: 'textPrimary', label: 'Primary Text', group: 'Typography' },
  { key: 'textSecondary', label: 'Secondary Text', group: 'Typography' },
  { key: 'borderColor', label: 'Border Color', group: 'Borders' },
];

// ─── Apply theme as CSS custom properties on :root ───
export function applyThemeToDOM(theme: SiteTheme) {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary-bg', theme.primaryBg);
  root.style.setProperty('--theme-secondary-bg', theme.secondaryBg);
  root.style.setProperty('--theme-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-accent-hover', theme.accentHover);
  root.style.setProperty('--theme-text-primary', theme.textPrimary);
  root.style.setProperty('--theme-text-secondary', theme.textSecondary);
  root.style.setProperty('--theme-border-color', theme.borderColor);
  root.style.setProperty('--theme-header-bg', theme.headerBg);
}

export function loadThemeFromStorage(): SiteTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_THEME, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  return { ...DEFAULT_THEME };
}

export function saveThemeToStorage(theme: SiteTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

// ─── ThemeEditor Component ───
interface ThemeEditorProps {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Backgrounds');
  const [showPresets, setShowPresets] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const handleColorChange = useCallback((key: keyof SiteTheme, value: string) => {
    const updated = { ...theme, [key]: value };
    setTheme(updated);
    applyThemeToDOM(updated);
  }, [theme, setTheme]);

  const handleReset = useCallback(() => {
    setTheme({ ...DEFAULT_THEME });
    applyThemeToDOM(DEFAULT_THEME);
    saveThemeToStorage(DEFAULT_THEME);
  }, [setTheme]);

  const handleSave = useCallback(() => {
    saveThemeToStorage(theme);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, [theme]);

  const handlePresetApply = useCallback((preset: Partial<SiteTheme>) => {
    const updated = { ...DEFAULT_THEME, ...preset };
    setTheme(updated);
    applyThemeToDOM(updated);
    saveThemeToStorage(updated);
    setShowPresets(false);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, [setTheme]);

  // Group the color fields
  const groups = COLOR_FIELDS.reduce<Record<string, typeof COLOR_FIELDS>>((acc, field) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-[9px] uppercase font-bold tracking-widest transition-all rounded-none border bg-violet-600 text-white border-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)] hover:bg-violet-500"
      >
        <Palette size={12} />
        Theme Editor
      </button>
    );
  }

  return (
    <div className="fixed top-28 right-4 z-[2000] w-80 max-h-[75vh] overflow-hidden flex flex-col rounded-none shadow-2xl shadow-black/60 border border-white/10 animate-in slide-in-from-right">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between shrink-0"
        style={{ background: theme.secondaryBg }}
      >
        <div className="flex items-center gap-2">
          <Palette size={16} style={{ color: theme.accent }} />
          <span className="text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color: theme.textPrimary }}>
            Theme Editor
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-sm transition-all ${saveFlash ? 'bg-emerald-500/30 text-emerald-300' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
            title="Save to browser"
          >
            <Save size={13} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-sm hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            title="Reset to default"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-sm hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Save flash banner */}
      {saveFlash && (
        <div className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-center bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30">
          ✓ Theme saved to browser
        </div>
      )}

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: theme.primaryBg }}
      >
        {/* Preset Palettes */}
        <div className="border-b" style={{ borderColor: theme.borderColor }}>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full px-4 py-3 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest transition-all hover:bg-white/5"
            style={{ color: theme.accent }}
          >
            <span className="flex items-center gap-2">
              <Pipette size={12} />
              Quick Presets
            </span>
            {showPresets ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showPresets && (
            <div className="px-3 pb-3 grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetApply(preset.theme)}
                  className="group relative flex flex-col items-start gap-1.5 p-2.5 rounded-sm border transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: theme.borderColor,
                    background: preset.theme.primaryBg,
                  }}
                >
                  {/* Color preview dots */}
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: preset.theme.accent }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: preset.theme.secondaryBg }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: preset.theme.textPrimary }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: preset.theme.accentHover }} />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: preset.theme.textPrimary }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color channel groups */}
        {Object.entries(groups).map(([groupName, fields]) => (
          <div key={groupName} className="border-b" style={{ borderColor: theme.borderColor }}>
            <button
              onClick={() => setExpandedGroup(expandedGroup === groupName ? null : groupName)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest transition-all hover:bg-white/5"
              style={{ color: theme.textSecondary }}
            >
              <span>{groupName}</span>
              {expandedGroup === groupName ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {expandedGroup === groupName && (
              <div className="px-4 pb-3 space-y-2.5">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {/* Native color input styled as a swatch */}
                      <div className="relative w-7 h-7 shrink-0 rounded-sm overflow-hidden border border-white/20 shadow-inner cursor-pointer group">
                        <div className="absolute inset-0" style={{ background: theme[field.key] }} />
                        <input
                          type="color"
                          value={theme[field.key]}
                          onChange={(e) => handleColorChange(field.key, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <span
                        className="text-[10px] font-semibold tracking-wider truncate"
                        style={{ color: theme.textSecondary }}
                      >
                        {field.label}
                      </span>
                    </div>
                    {/* Hex code input */}
                    <input
                      type="text"
                      value={theme[field.key]}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v) || v === '') {
                          handleColorChange(field.key, v);
                        }
                      }}
                      className="w-20 text-[9px] font-mono px-2 py-1 rounded-sm border focus:outline-none transition-all"
                      style={{
                        background: theme.primaryBg,
                        color: theme.textPrimary,
                        borderColor: theme.borderColor,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Live Preview strip */}
        <div className="px-4 py-3">
          <div className="text-[9px] uppercase font-bold tracking-widest mb-2" style={{ color: theme.textSecondary }}>
            Live Preview
          </div>
          <div
            className="rounded-sm p-3 border flex flex-col gap-2"
            style={{ background: theme.secondaryBg, borderColor: theme.borderColor }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: theme.accent }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: theme.textPrimary }}>
                Sample Heading
              </span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: theme.textSecondary }}>
              This previews your active theme with current colors applied in real-time.
            </p>
            <div className="flex gap-2 mt-1">
              <div className="px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest" style={{ background: theme.accent, color: theme.primaryBg }}>
                Primary Action
              </div>
              <div
                className="px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest border"
                style={{ borderColor: theme.borderColor, color: theme.textSecondary }}
              >
                Secondary
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
