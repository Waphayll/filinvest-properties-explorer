export type TownshipBrand = 'Premier Township' | 'Coastal Hub' | 'High Growth Area' | 'Exurban Community';

export interface CommercialProject {
  id: string;
  name: string;
  brand: TownshipBrand;
  location: string;
  shortDescription: string;
  fullDescription: string;
  highlightText?: string;
  bgImage: string;
  averageLotSize: string;
  averagePriceRange: string;
  featureBadge?: string;
  center?: [number, number]; // Latitude, Longitude center point for OpenStreetMap
  zoom?: number;               // Default zoom level
  conceptMapSvg?: string;      // URL to the concept map SVG file
}

export interface CommercialLot {
  id: string;
  projectId: string;
  lotNumber: string;
  blockNumber: string;
  areaSqm: number;
  pricePerSqm: number; // in PHP
  structureSize?: number; // optional structure size in sqm
  structurePrice?: number; // optional structure price in PHP
  far: number; // Floor Area Ratio
  status: 'Available' | 'Reserved';
  points: string; // SVG path points or polyline coords representation for rendering
  labelText?: string; // Short code to display in the center of the lot
  coordinates?: [number, number][]; // Lat-Lng polygon boundary coordinates for OpenStreetMap
  colorOverride?: string; // Custom polygon color override (e.g. '#E53E3E' for red)
}

export interface InvestorLead {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  brokerName?: string;
  timestamp: string;
  selectedProjectName: string;
  selectedLotNumber: string;
}

export interface SurveyorBearing {
  direction1: 'N' | 'S';
  degrees: number;
  minutes: number;
  direction2: 'E' | 'W';
}

export interface SurveyorLine {
  from: number;
  to: number;
  bearing: SurveyorBearing;
  distance_m: number;
}

export interface SurveyorData {
  lot: string;
  area_sqm: number;
  lines: SurveyorLine[];
}
