
export type Brand = 'Filigree' | 'Aspire' | 'Prestige' | 'Office Spaces';

export interface Project {
  id: string;
  name: string;
  brand: Brand;
  location: string;
  address: string;
  coordinates: [number, number];
  description: string;
  unitTypes?: string;
  amenities?: string;
  highlights?: string;
  pricePoint?: string;
  target?: string;
  imageUrl?: string;
}
