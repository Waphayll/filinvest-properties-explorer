import { CommercialProject, CommercialLot } from './types';
import lotOverridesData from './lotCoordinates.json';
const lotOverrides = lotOverridesData as Record<string, [number, number][]>;

export const COMMERCIAL_PROJECTS: CommercialProject[] = [
  {
    id: 'filinvest-city',
    name: 'Filinvest City',
    brand: 'Premier Township',
    location: 'Alabang, Muntinlupa',
    shortDescription: 'The premier garden business district of the south.',
    fullDescription: 'Filinvest City is a fully integrated, self-contained, and green-certified 244-hectare township. It serves as the business engine of Metro Manila South with state-of-the-art infrastructure. Feature launch is focused on Block 13 and Block 14 commercial slots, situated adjacent to high-density premium developments.',
    highlightText: 'FEATURE LAUNCH: BLOCK 14 COMMERCIAL LOTS',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    averageLotSize: '1,500 – 5,700 sqm',
    averagePriceRange: '₱396,000 – ₱766,000 / sqm',
    featureBadge: 'Feature Launch: Block 13 & 14',
    center: [14.4172, 121.0354],
    zoom: 15
  },
  {
    id: 'city-di-mare',
    name: 'City di Mare',
    brand: 'Coastal Hub',
    location: 'South Road Properties, Cebu City',
    shortDescription: 'The master-planned coastal city of the Visayas.',
    fullDescription: 'Spread across 58 hectares on Cebu\'s prime waterfront, City di Mare is an vibrant, master-planned commercial and residential hub offering unmatched ocean views and connectivity to the key transit lines of Cebu.',
    highlightText: 'WATERFRONT COMMERCIAL DISTRICT',
    bgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    averageLotSize: '1,500 – 4,600 sqm',
    averagePriceRange: '₱294,000 – ₱408,000 / sqm',
    featureBadge: 'Waterfront Prime',
    center: [10.2715, 123.8788],
    zoom: 15
  },
  {
    id: 'daang-hari-lots',
    name: 'Daang Hari Commercial Lots',
    brand: 'High Growth Area',
    location: 'Las Piñas - Cavite Corridor',
    shortDescription: 'High-visibility highwaycommercial opportunities.',
    fullDescription: 'Daang Hari commercial strips offer maximum highway visibility along a booming transportation avenue. Ideal for high-density commercial strips, retail showrooms, regional offices, and institutional developments.',
    highlightText: 'HIGH-WAY VISIBILITY FRONTAGE',
    bgImage: 'https://images.unsplash.com/photo-1570129476815-ba368ac77011?auto=format&fit=crop&w=1200&q=80',
    averageLotSize: '700 – 1,600 sqm',
    averagePriceRange: '₱226,000 / sqm',
    featureBadge: 'High Frontage',
    center: [14.3820, 121.0125],
    zoom: 16
  },
  {
    id: 'brentville-front',
    name: 'Brentville - The Village Front',
    brand: 'Exurban Community',
    location: 'Mamplasan, Biñan, Laguna',
    shortDescription: 'Prestigious commercial enclave right at the gateway to the South.',
    fullDescription: 'Nestled next to the Mamplasan Exit (SLEX), Brentville is a boutique exurban community. The Village Front provides high-end commercial spaces tailored for boutique grocers, specialty lifestyle hubs, and premium institutional spaces.',
    highlightText: 'GATEWAY TO CALABARZON',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    averageLotSize: '780 – 1,250 sqm',
    averagePriceRange: '₱131,990 – ₱152,851 / sqm',
    featureBadge: 'SLEX Frontage',
    center: [14.3142, 121.0833],
    zoom: 16
  }
];

// Dynamically generate properly coordinate-positioned lots to ensure perfect layout without overlaps
const generateFCPalmsLots = (): CommercialLot[] => {
  // Block 13 "Palms" lots along Pacific Rim Blvd / Filinvest Ave, Alabang
  // Lots arranged vertically (north-to-south) along the east side of Pacific Rim
  const lots: CommercialLot[] = [
    {
      id: 'fc-palms-2-B-7',
      projectId: 'filinvest-city',
      lotNumber: '2-B-7',
      blockNumber: 'Block 13',
      areaSqm: 1940,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '50,120 90,120 90,170 50,170',
      labelText: '2-B-7',
      colorOverride: '#DC2626',
      coordinates: [
        [14.41620, 121.03340],
        [14.41620, 121.03410],
        [14.41580, 121.03410],
        [14.41580, 121.03340]
      ]
    },
    {
      id: 'fc-palms-2-B-6',
      projectId: 'filinvest-city',
      lotNumber: '2-B-6',
      blockNumber: 'Block 13',
      areaSqm: 2052,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '100,120 140,120 140,170 100,170',
      labelText: '2-B-6',
      colorOverride: '#DC2626',
      coordinates: [
        [14.41575, 121.03340],
        [14.41575, 121.03410],
        [14.41530, 121.03410],
        [14.41530, 121.03340]
      ]
    },
    {
      id: 'fc-palms-2-B-5',
      projectId: 'filinvest-city',
      lotNumber: '2-B-5',
      blockNumber: 'Block 13',
      areaSqm: 2235,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '150,120 190,120 190,170 150,170',
      labelText: '2-B-5',
      colorOverride: '#DC2626',
      coordinates: [
        [14.41525, 121.03340],
        [14.41525, 121.03415],
        [14.41475, 121.03415],
        [14.41475, 121.03340]
      ]
    },
    {
      id: 'fc-palms-2-B-4',
      projectId: 'filinvest-city',
      lotNumber: '2-B-4',
      blockNumber: 'Block 13',
      areaSqm: 2607,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '200,120 240,120 240,170 200,170',
      labelText: '2-B-4',
      colorOverride: '#DC2626',
      coordinates: [
        [14.41470, 121.03340],
        [14.41470, 121.03420],
        [14.41415, 121.03420],
        [14.41415, 121.03340]
      ]
    },
    {
      id: 'fc-palms-2-B-1',
      projectId: 'filinvest-city',
      lotNumber: '2-B-1',
      blockNumber: 'Block 13',
      areaSqm: 5716,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '250,120 330,120 330,170 250,170',
      labelText: '2-B-1',
      colorOverride: '#DC2626',
      coordinates: [
        [14.41410, 121.03310],
        [14.41410, 121.03430],
        [14.41310, 121.03430],
        [14.41310, 121.03310]
      ]
    }
  ];

  return lots;
};

const generateFCSpectrumLots = (): CommercialLot[] => {
  const spectrumCenter: [number, number] = [14.4140, 121.0392];
  const data = [
    { num: 'Blk 1 Lot 2', size: 1524, price: 592000, far: 10 },
    { num: 'Blk 8 Lot 4', size: 2247, price: 626000, far: 10 },
    { num: 'Blk 11 Lot 3', size: 2628, price: 749000, far: 10 },
    { num: 'Blk 20 Lot 4', size: 2265, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 5', size: 2292, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 6', size: 2293, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 1', size: 2358, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 2', size: 3139, price: 766000, far: 10 },
    { num: 'Blk 21 Lot 3-A', size: 2010, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 4', size: 2189, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 5', size: 2113, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 6', size: 2181, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 3-B', size: 2186, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 4', size: 2634, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 7', size: 2595, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 2-E-2-B-5', size: 3411, price: 592000, far: 10 },
    { num: 'Blk 27 Lot 2-E-2-B-6', size: 1779, price: 592000, far: 10 },
    { num: 'Blk 27 Lot 2-E-2-B-6-Alt', size: 4593, price: 626000, far: 10 }
  ];
  return data.map((d, index) => {
    const colLength = 4;
    const row = Math.floor(index / colLength);
    const col = index % colLength;
    const startLat = spectrumCenter[0] + row * 0.0007;
    const startLng = spectrumCenter[1] + col * 0.00065;
    return {
      id: `fc-spectrum-${d.num.replace(/\s+/g, '-')}`,
      projectId: 'filinvest-city',
      lotNumber: d.num,
      blockNumber: d.num.includes('Blk') ? d.num.split(' Lot')[0] : 'Block Spectrum',
      areaSqm: d.size,
      pricePerSqm: d.price,
      far: d.far,
      status: (index === 3 || index === 11 || index === 14 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${100 + col * 90},${220 + row * 80} ${170 + col * 90},${220 + row * 80} ${170 + col * 90},${280 + row * 80} ${100 + col * 90},${280 + row * 80}`,
      labelText: d.num.replace('Lot ', 'L').replace('Blk ', 'B'),
      coordinates: [
        [startLat, startLng],
        [startLat + 0.00028, startLng],
        [startLat + 0.00028, startLng + 0.00045],
        [startLat, startLng + 0.00045]
      ] as [number, number][]
    };
  });
};

const generateFCNorthgateLots = (): CommercialLot[] => {
  const northgateCenter: [number, number] = [14.4191, 121.0368];
  return [
    {
      id: 'fc-northgate-blk46-l1',
      projectId: 'filinvest-city',
      lotNumber: 'Lot 1',
      blockNumber: 'Block 46',
      areaSqm: 1545,
      pricePerSqm: 581000,
      far: 10,
      status: 'Available',
      points: '500,100 580,100 580,170 500,170',
      labelText: 'B46 L1',
      colorOverride: '#06b6d4', // Cyan color
      coordinates: [
        [northgateCenter[0], northgateCenter[1]],
        [northgateCenter[0] + 0.00025, northgateCenter[1]],
        [northgateCenter[0] + 0.00025, northgateCenter[1] + 0.00048],
        [northgateCenter[0], northgateCenter[1] + 0.00048]
      ] as [number, number][]
    }
  ];
};

const generateCDMLots = (): CommercialLot[] => {
  const cdmCenter: [number, number] = [10.2721, 123.8765];
  // Greenway Block 1
  const greenwayData = [
    { num: 'Lot 1', size: 1505, price: 328000, far: 10 },
    { num: 'Lot 2', size: 1561, price: 313000, far: 10 },
    { num: 'Lot 21', size: 1528, price: 313000, far: 10 },
    { num: 'Lot 20', size: 1531, price: 294000, far: 10 },
    { num: 'Lot 3', size: 2092, price: 313000, far: 10 },
    { num: 'Lot 4', size: 2085, price: 313000, far: 10 },
    { num: 'Lot 5', size: 2081, price: 313000, far: 10 },
    { num: 'Lot 6', size: 1996, price: 313000, far: 10 },
    { num: 'Lot 19', size: 2016, price: 294000, far: 10 },
    { num: 'Lot 18', size: 2019, price: 294000, far: 10 },
    { num: 'Lot 17', size: 2020, price: 294000, far: 10 },
    { num: 'Lot 16', size: 2022, price: 294000, far: 10 },
    { num: 'Lot 7', size: 1923, price: 313000, far: 10 },
    { num: 'Lot 8', size: 1901, price: 313000, far: 10 },
    { num: 'Lot 9', size: 1868, price: 313000, far: 10 },
    { num: 'Lot 10', size: 1994, price: 345000, far: 10 },
    { num: 'Lot 15', size: 1792, price: 294000, far: 10 },
    { num: 'Lot 14', size: 1794, price: 294000, far: 10 },
    { num: 'Lot 12', size: 1808, price: 294000, far: 10 },
    { num: 'Lot 11', size: 2189, price: 345000, far: 10 }
  ];
  
  const greenwayLots = greenwayData.map((d, index) => {
    const colLength = 4;
    const row = Math.floor(index / colLength);
    const col = index % colLength;
    const startLat = cdmCenter[0] + row * 0.00045;
    const startLng = cdmCenter[1] - 0.0022 + col * 0.00055;
    return {
      id: `cdm-greenway-${d.num.replace(/\s+/g, '-')}`,
      projectId: 'city-di-mare',
      lotNumber: d.num,
      blockNumber: 'Block 1 (Greenway)',
      areaSqm: d.size,
      pricePerSqm: d.price,
      far: d.far,
      status: (index === 4 || index === 11 || index === 17 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${60 + col * 85},${120 + row * 75} ${125 + col * 85},${120 + row * 75} ${125 + col * 85},${180 + row * 75} ${60 + col * 85},${180 + row * 75}`,
      labelText: d.num,
      coordinates: [
        [startLat, startLng],
        [startLat + 0.00018, startLng],
        [startLat + 0.00018, startLng + 0.00042],
        [startLat, startLng + 0.00042]
      ] as [number, number][]
    };
  });

  // Coastal Block 2
  const coastalData = [
    { num: 'Lot 1', size: 3657, price: 396000, far: 16 },
    { num: 'Lot 5', size: 3571, price: 396000, far: 12 },
    { num: 'Lot 2', size: 3333, price: 390000, far: 12 },
    { num: 'Lot 4', size: 3946, price: 408000, far: 12 },
    { num: 'Lot 3', size: 4614, price: 408000, far: 12 }
  ];

  const coastalLots = coastalData.map((d, index) => {
    const startLat = 10.2710 + (index - 2) * 0.00035;
    const startLng = 123.8812;
    return {
      id: `cdm-coastal-${d.num.replace(/\s+/g, '-')}`,
      projectId: 'city-di-mare',
      lotNumber: d.num,
      blockNumber: 'Block 2 (Coastal)',
      areaSqm: d.size,
      pricePerSqm: d.price,
      far: d.far,
      status: (index === 3 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${650},${120 + index * 75} ${780},${120 + index * 75} ${780},${180 + index * 75} ${650},${180 + index * 75}`,
      labelText: d.num,
      coordinates: [
        [startLat, startLng],
        [startLat + 0.00022, startLng],
        [startLat + 0.00022, startLng + 0.00055],
        [startLat, startLng + 0.00055]
      ] as [number, number][]
    };
  });

  return [...greenwayLots, ...coastalLots];
};

const generateDHLots = (): CommercialLot[] => {
  const dhCenter: [number, number] = [14.3820, 121.0125];
  const data = [
    { num: 'Lot 2A-1', size: 1621, price: 226000, far: 2 },
    { num: 'Lot 2A-2', size: 742, price: 226000, far: 2 },
    { num: 'Lot 2B', size: 742, price: 226000, far: 2 },
    { num: 'Lot 2C', size: 742, price: 226000, far: 2 },
    { num: 'Lot 2D', size: 742, price: 226000, far: 2 },
    { num: 'Lot 2E', size: 742, price: 226000, far: 2 },
    { num: 'Lot 2G', size: 718, price: 226000, far: 2 }
  ];
  return data.map((d, index) => {
    const startLng = dhCenter[1] - 0.0015 + index * 0.0005;
    const startLat = dhCenter[0];
    return {
      id: `dh-lots-${d.num.replace(/\s+/g, '-')}`,
      projectId: 'daang-hari-lots',
      lotNumber: d.num,
      blockNumber: 'Block 1',
      areaSqm: d.size,
      pricePerSqm: d.price,
      far: d.far,
      status: (index === 5 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${100 + index * 100},220 ${180 + index * 100},220 ${180 + index * 100},350 ${100 + index * 100},350`,
      labelText: d.num,
      coordinates: [
        [startLat, startLng],
        [startLat + 0.0002, startLng],
        [startLat + 0.0002, startLng + 0.0004],
        [startLat, startLng + 0.0004]
      ] as [number, number][]
    };
  });
};

const generateBVF_Lots = (): CommercialLot[] => {
  const bvfCenter: [number, number] = [14.3142, 121.0833];
  const data = [
    { num: 'Lot 10', size: 846, price: 152836.88, far: 2 },
    { num: 'Lot 4', size: 789, price: 152851.71, far: 2 },
    { num: 'Lot 5', size: 817, price: 152753.98, far: 2 },
    { num: 'Lot 6', size: 844, price: 131990.52, far: 2 },
    { num: 'Lot 7', size: 1056, price: 137215.91, far: 2 },
    { num: 'Lot 8', size: 1244, price: 137218.65, far: 2 }
  ];
  return data.map((d, index) => {
    const startLng = bvfCenter[1] - 0.0012 + index * 0.00042;
    const startLat = bvfCenter[0];
    return {
      id: `bvf-lots-${d.num.replace(/\s+/g, '-')}`,
      projectId: 'brentville-front',
      lotNumber: d.num,
      blockNumber: 'Block 1',
      areaSqm: d.size,
      pricePerSqm: Math.round(d.price * 100) / 100,
      far: d.far,
      status: (index === 3 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${100 + index * 110},220 ${190 + index * 110},220 ${190 + index * 110},330 ${100 + index * 110},330`,
      labelText: d.num,
      coordinates: [
        [startLat, startLng],
        [startLat + 0.00018, startLng],
        [startLat + 0.00018, startLng + 0.00038],
        [startLat, startLng + 0.00038]
      ] as [number, number][]
    };
  });
};

export const COMMERCIAL_LOTS: CommercialLot[] = [
  ...generateFCPalmsLots(),
  ...generateFCSpectrumLots(),
  ...generateFCNorthgateLots(),
  ...generateCDMLots(),
  ...generateDHLots(),
  ...generateBVF_Lots()
].map(lot => {
  if (lotOverrides && lotOverrides[lot.id]) {
    return { ...lot, coordinates: lotOverrides[lot.id] };
  }
  return lot;
});

export const BRAND_COLORS_COMMERCIAL = {
  'Premier Township': '#D4AF37',    // Luxury Gold
  'Coastal Hub': '#38BDF8',         // Sky Blue
  'High Growth Area': '#34D399',     // Emerald Green
  'Exurban Community': '#F87171'     // Calming Coral Rose
};
