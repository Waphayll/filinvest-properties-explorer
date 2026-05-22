export type ProjectId = 'filinvest-city' | 'city-di-mare' | 'daang-hari' | 'village-front';
export type LotStatus = 'available' | 'sold' | 'reserved';

export interface Lot {
  id: string;
  block: string;
  lotNumber: string;
  district?: string;
  lotArea: number;       // sqm
  pricePerSqm: number;   // PHP
  tcp: number;           // PHP
  far: number;
  status: LotStatus;
  // Daang Hari Lot 2G only
  hasStructure?: boolean;
  structureArea?: number;
  structurePrice?: number;
  structureTcp?: number;
}

export interface CommercialProject {
  id: ProjectId;
  name: string;
  shortName: string;
  location: string;
  description: string;
  lotCuts: string;
  farRange: string;
  priceRange: string;
  lots: Lot[];
}
