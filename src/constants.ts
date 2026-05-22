import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1001-parkway',
    name: '1001 Parkway',
    brand: 'Filigree',
    location: 'Filinvest City, Alabang',
    address: 'Alabang, Muntinlupa, Metro Manila',
    coordinates: [14.41412, 121.03720],
    description: 'Located on "Millionaire\'s Row"; features bi-level garden units.',
    unitTypes: '1BR to 3BR Garden & Penthouse (52–237 sqm)',
    amenities: '50m lap pool, dog park, yoga studio, indoor/outdoor kids\' play areas',
    highlights: 'Ultra-luxury high-density living in the heart of the corporate district.',
    imageUrl: 'https://picsum.photos/seed/1001/1200/800'
  },
  {
    id: 'golf-ridge',
    name: 'Golf Ridge',
    brand: 'Filigree',
    location: 'Mimosa Plus, Clark',
    address: 'Filinvest Mimosa Plus Leisure City, Narra Lp, Clark Freeport Zone, Pampanga',
    coordinates: [15.18450, 120.51514],
    description: 'Direct views of the Mimosa Plus Golf Course; "Country Club" lifestyle.',
    unitTypes: '1BR to 3BR (approx. 82–249 sqm)',
    amenities: 'Infinity pool overlooking golf course, private drop-off, key-card access',
    highlights: 'Direct access to high-end golf club facilities.',
    imageUrl: 'https://picsum.photos/seed/golf/1200/800'
  },
  {
    id: 'botanika',
    name: 'Botanika Nature Residences',
    brand: 'Filigree',
    location: 'Filinvest City, Alabang',
    address: 'Laguna Heights Dr, Muntinlupa, 1781 Metro Manila',
    coordinates: [14.40923, 121.03451],
    description: 'Completed (RFO); 70% open space; BERDE 4-star certified.',
    unitTypes: '2BR to 3BR Deluxe/Premier (125–343 sqm)',
    amenities: 'Tiered swimming pools, greenhouse, central atrium, scenic elevators',
    highlights: 'Where vertical living meets the verdant expanse of nature.',
    imageUrl: 'https://picsum.photos/seed/botanika1/1200/800'
  },
  {
    id: 'studio-n',
    name: 'Studio N',
    brand: 'Aspire',
    location: 'Alabang',
    address: 'Northgate Avenue, Northgate Cyberzone, Filinvest City, Alabang, Muntinlupa, Metro Manila',
    coordinates: [14.42583, 121.03733],
    description: 'Smart living solutions for upwardly mobile professionals in Northgate Cyberzone.',
    unitTypes: 'Primarily Studio units (approx. 18–19 sqm)',
    amenities: 'Swimming pool, fitness center, function room, and gazebo',
    pricePoint: '₱3.9M – ₱4.7M',
    target: 'BPO/Tech professionals',
    imageUrl: 'https://picsum.photos/seed/studio/1200/800'
  },
  {
    id: 'the-levels',
    name: 'The Levels',
    brand: 'Aspire',
    location: 'Alabang',
    address: 'Pacific Rim Cor. Commerce Ave., Filinvest City, Alabang, Muntinlupa City, 1781 Metro Manila',
    coordinates: [14.42001, 121.03326],
    description: '4-tower "California lifestyle" complex with landscaped courtyards.',
    unitTypes: 'Studio, 1BR, and 2BR (approx. 36–72 sqm)',
    amenities: 'Billiards room, table tennis, and swimming pool',
    pricePoint: '₱10.5M – ₱30M',
    imageUrl: 'https://picsum.photos/seed/levels/1200/800'
  },
  {
    id: 'celestia',
    name: 'Celestia',
    brand: 'Prestige',
    location: 'San Mateo',
    address: 'Timberland Heights, San Mateo, Rizal',
    coordinates: [14.68250, 121.16041],
    description: 'High-altitude living with panoramic views of the Sierra Madre.',
    unitTypes: 'Exclusive Enclave',
    amenities: 'Mountain views, cool climate, Timberland Highlands Resort access',
    highlights: 'Designed with AECOM and H1 Architecture.',
    imageUrl: 'https://picsum.photos/seed/celestia/1200/800'
  },
  {
    id: 'the-glades',
    name: 'The Glades',
    brand: 'Prestige',
    location: 'San Mateo',
    address: 'Brgy. Malanday, Green Trail, San Mateo, Rizal',
    coordinates: [14.68247, 121.16318],
    description: 'Luxury residential enclave nestled in the heart of nature.',
    unitTypes: 'Modern country houses and lots (113–163 sqm)',
    amenities: 'Nature trails, infinity pools, Timberland Resort access',
    pricePoint: '₱5.3M – ₱17M',
    imageUrl: 'https://picsum.photos/seed/glades/1200/800'
  },
  {
    id: 'parkway-corporate',
    name: 'Parkway Corporate Center',
    brand: 'Office Spaces',
    location: 'Alabang',
    address: 'Corporate Ave. cor. Parkway Place, Filinvest City, Alabang, Muntinlupa, 1781 Metro Manila',
    coordinates: [14.41551, 121.03799],
    description: '32-storey boutique office building aimed at owner-users.',
    unitTypes: 'Office spaces starting at 36 sqm',
    amenities: 'Business center, podium parking, and a retail plaza',
    highlights: 'End-user professional focus; prestigious corporate address.',
    imageUrl: 'https://picsum.photos/seed/corp/1200/800'
  }
];

export const BRAND_COLORS = {
  'Filigree': '#D4AF37',   // Brighter Gold
  'Aspire': '#60A5FA',    // Brighter Blue
  'Prestige': '#34D399',  // Brighter Green
  'Office Spaces': '#F1F5F9' // Brighter Light Slate
};
