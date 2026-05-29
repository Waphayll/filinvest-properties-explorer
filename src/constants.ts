import { CommercialProject, CommercialLot } from './types';
import lotOverridesData from './lotCoordinates.json';
import conceptOverridesData from './conceptCoordinates.json';
const lotOverrides = lotOverridesData as unknown as Record<string, [number, number][]>;
const conceptOverrides = conceptOverridesData as unknown as Record<string, string>;

export const COMMERCIAL_PROJECTS: CommercialProject[] = [
  {
    id: 'filinvest-city',
    name: 'Filinvest City',
    brand: 'Premier Township',
    location: 'Alabang, Muntinlupa',
    carouselImage: '/FC/FC_Carousel.jpg',
    logoImage: '/FC/FC Logo/Filinvest City Logo(horizontal).png',
    fullDescription: [
      'Situated in Alabang, Muntinlupa City, Filinvest City is a 244-hectare, predominantly mixed-use district thoughtfully designed for modern urban living. As a green-certified Garden CBD, it stands as a thriving gateway to the growth corridors of both Southern and Northern Luzon, and the preferred address of many leading multinational and local corporations.',
      'More than a business destination, Filinvest City fosters a dynamic live-work-play lifestyle — bringing together residential communities, corporate spaces, retail and leisure destinations, educational institutions, and medical and wellness hubs in one seamlessly connected urban environment.',
      'Rooted in sustainability and built for progress, it is a place where communities flourish, opportunities grow, and the future continues to take shape.'
    ],
    highlightText: 'FEATURE LAUNCH: BLOCK 14 COMMERCIAL LOTS',
    bgImage: '/filinvest_city.png',
    averageLotSize: '1,500 – 5,700 sqm',
    averagePriceRange: '₱396,000 – ₱766,000 / sqm',
    featureBadge: 'Feature Launch: Block 13 & 14',
    center: [14.4172, 121.0354],
    zoom: 15,
    conceptMapSvg: 'FC.svg'
  },
  {
    id: 'city-di-mare',
    name: 'CDM (City di Mare)',
    brand: 'Coastal Hub',
    location: 'South Road Properties, Cebu City',
    carouselImage: '/CDM/CDM_Carousel.jpg',
    logoImage: '/CDM/CDM-Logo/Horizontal - Full Color.png',
    fullDescription: [
      'CDM (City di Mare) in Cebu City is a master-planned township designed to offer a modern live-work-play lifestyle in harmony with nature. Spanning 58 hectares, its premier development features a 40-hectare mixed-use zone, a collaborative project between the Cebu City government and Filinvest Land Inc., alongside a 10-hectare commercial component.',
      'The Filinvest Group also acquired 8.1 hectares in South Road Properties (SRP), set to become a dynamic mixed-use project with residential, commercial, office, and retail spaces, further expanding the vibrant CDM community.'
    ],
    highlightText: 'WATERFRONT COMMERCIAL DISTRICT',
    bgImage: '/cdm.jpg',
    averageLotSize: '1,500 – 4,600 sqm',
    averagePriceRange: '₱294,000 – ₱408,000 / sqm',
    featureBadge: 'Waterfront Prime',
    center: [10.2715, 123.8788],
    zoom: 15,
    conceptMapSvg: 'CDM.svg'
  },
  {
    id: 'daang-hari-lots',
    name: 'Daang Hari Commercial Lots',
    brand: 'High Growth Area',
    location: 'Las Piñas',
    carouselImage: '/DH/Daang Hari/DH_Carousel.jpg',
    fullDescription: [
      'Located along the rapidly developing Daang Hari corridor, Daang Hari Commercial Lots offers prime commercial opportunities within one of South Metro Manila\'s emerging mixed-use growth areas.',
      'Strategically positioned with convenient access to MCX, and adjacent to numerous high-end residential developments, the development benefits from increasing commercial activity and regional connectivity.',
      'With accessible frontage along Daang Hari and proximity to key lifestyle developments, the property is well-positioned for a range of commercial and retail uses.'
    ],
    highlightText: 'HIGH-WAY VISIBILITY FRONTAGE',
    bgImage: '/daanghari.jpg',
    averageLotSize: '700 – 1,600 sqm',
    averagePriceRange: '₱226,000 / sqm',
    featureBadge: 'High Frontage',
    center: [14.3820, 121.0125],
    zoom: 16,
    conceptMapSvg: 'THE ENCLAVE ALABANG.svg'
  },
  {
    id: 'brentville-front',
    name: 'Brentville - The Village Front',
    brand: 'Exurban Community',
    location: 'Biñan, Laguna',
    carouselImage: '/TVF/TVF_Carousel.png',
    logoImage: '/TVF/BVI-logo.png',
    fullDescription: [
      'Brentville International Community is an established residential enclave in Biñan, Laguna, strategically located near SLEX, CALAX, and the Mamplasan exit — providing convenient access to Metro Manila, Filinvest City, and the broader CALABARZON growth corridor. Home to Brent International School, the community has long been recognized as one of the South\'s premier residential addresses.',
      'Located at the entrance of the community is The Village Front, a 4.2 hectare neighborhood retail and lifestyle destination designed to support the daily needs and activities of Brentville\'s growing residential population.'
    ],
    highlightText: 'GATEWAY TO CALABARZON',
    bgImage: '/thevillagefront.jpg',
    averageLotSize: '780 – 1,250 sqm',
    averagePriceRange: '₱131,990 – ₱152,851 / sqm',
    featureBadge: 'SLEX Frontage',
    center: [14.3142, 121.0833],
    zoom: 16,
    conceptMapSvg: 'Brentville.svg'
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
      lotNumber: 'Blk 13 Lot 2-B-7',
      blockNumber: 'Palms',
      areaSqm: 1940,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '50,120 90,120 90,170 50,170',
      labelText: '2-B-7',
      colorOverride: '#fdb10c',
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
      lotNumber: 'Blk 13 Lot 2-B-6',
      blockNumber: 'Palms',
      areaSqm: 2052,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '100,120 140,120 140,170 100,170',
      labelText: '2-B-6',
      colorOverride: '#fdb10c',
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
      lotNumber: 'Blk 13 Lot 2-B-5',
      blockNumber: 'Palms',
      areaSqm: 2235,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '150,120 190,120 190,170 150,170',
      labelText: '2-B-5',
      colorOverride: '#fdb10c',
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
      lotNumber: 'Blk 13 Lot 2-B-4',
      blockNumber: 'Palms',
      areaSqm: 2607,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '200,120 240,120 240,170 200,170',
      labelText: '2-B-4',
      colorOverride: '#fdb10c',
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
      lotNumber: 'Blk 13 Lot 2-B-1',
      blockNumber: 'Palms',
      areaSqm: 5716,
      pricePerSqm: 396000,
      far: 6,
      status: 'Available',
      points: '250,120 330,120 330,170 250,170',
      labelText: '2-B-1',
      colorOverride: '#fdb10c',
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
    { num: 'Blk 1 Lot 3', size: 1524, price: 592000, far: 10 },
    { num: 'Blk 8 Lot 2', size: 2247, price: 626000, far: 10 },
    { num: 'Blk 11 Lot 4', size: 2628, price: 749000, far: 10 },
    { num: 'Blk 20 Lot 3', size: 2265, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 4', size: 2292, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 5', size: 2293, price: 592000, far: 10 },
    { num: 'Blk 20 Lot 6', size: 2358, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 1', size: 3139, price: 766000, far: 10 },
    { num: 'Blk 21 Lot 2', size: 2010, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 3', size: 2189, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 4', size: 2113, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 5', size: 2181, price: 592000, far: 10 },
    { num: 'Blk 21 Lot 6', size: 2186, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 3', size: 2634, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 4', size: 2595, price: 592000, far: 10 },
    { num: 'Blk 24 Lot 7', size: 3411, price: 592000, far: 10 },
    { num: 'Blk 27 Lot 2-E-2-B-5', size: 1779, price: 592000, far: 10 },
    { num: 'Blk 27 Lot 2-E-2-B-6', size: 4593, price: 626000, far: 10 }
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
      blockNumber: 'Spectrum',
      areaSqm: d.size,
      pricePerSqm: d.price,
      far: d.far,
      status: (index === 3 || index === 11 || index === 14 ? 'Reserved' : 'Available') as 'Available' | 'Reserved',
      points: `${100 + col * 90},${220 + row * 80} ${170 + col * 90},${220 + row * 80} ${170 + col * 90},${280 + row * 80} ${100 + col * 90},${280 + row * 80}`,
      labelText: d.num.replace('Lot ', 'L').replace('Blk ', 'B'),
      // Golden Yellow for all plots
      colorOverride: '#fdb10c',
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
      lotNumber: 'Blk 46 Lot 1',
      blockNumber: 'Northgate',
      areaSqm: 1545,
      pricePerSqm: 581000,
      far: 10,
      status: 'Available',
      points: '500,100 580,100 580,170 500,170',
      labelText: 'B46 L1',
      colorOverride: '#fdb10c', // Golden Yellow
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
      lotNumber: `Blk 1 ${d.num}`,
      blockNumber: 'Greenway',
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
      lotNumber: `Blk 2 ${d.num}`,
      blockNumber: 'Coastal',
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
    { num: 'Lot 2G', size: 718, price: 226000, far: 2, structureSize: 96, structurePrice: 14000000 }
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
      structureSize: d.structureSize,
      structurePrice: d.structurePrice,
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
  let updatedLot = { ...lot };
  if (lotOverrides && lotOverrides[lot.id]) {
    updatedLot.coordinates = lotOverrides[lot.id];
  }
  if (conceptOverrides && conceptOverrides[lot.id]) {
    updatedLot.points = conceptOverrides[lot.id];
  }
  return updatedLot;
});

export const BRAND_COLORS_COMMERCIAL = {
  'Premier Township': '#fdb10c',    // Golden Yellow
  'Coastal Hub': '#171796',         // Deep Blue
  'High Growth Area': '#06b29c',     // Teal
  'Exurban Community': '#df3703'     // Red-Orange
};

export const LANDING_BACKDROPS = [
  '/FC/FC_Carousel.jpg',
  '/FC/FC2.jpg',
  '/FC/DJI_20240418091225_0117_D copy.jpg',
  '/FC/DJI_20240418193633_0403_D.jpg',
  '/FC/DJI_20240418083134_0137_D.jpg',
  '/FC/DJI_20240418084740_0146_D copy.jpg',
  '/FC/DJI_20240418101617_0217_D.jpg',
  '/FC/DJI_20240418091440_0128_D.jpg',
  '/FC/DJI_20240418165701_0254_D.jpg',
  '/FC/DJI_20240418084946_0151_D copy.jpg',
  '/FC/DJI_20240419101050_0339_D.jpg',
  '/FC/DJI_20240418170940_0281_D.jpg',
  '/FC/DJI_20240418081749_0101_D copy.jpg',
  '/FC/DJI_20240418095945_0176_D.jpg',
  '/FC/DJI_20240418093954_0144_D.jpg',
  '/FC/DJI_20240418083210_0139_D.jpg',
  '/FC/DJI_20240418091150_0112_D copy.jpg',
  '/FC/DJI_20240418165434_0247_D.jpg',
  '/FC/DJI_20240418191700_0372_D.jpg',
  '/FC/DJI_20240418191556_0369_D.jpg',
  '/FC/DJI_20240418102032_0234_D.jpg',
  '/FC/DJI_20240418082543_0116_D.jpg',
  '/FC/DJI_20240418170221_0265_D.jpg',
  '/FC/DJI_20240418101400_0209_D.jpg',
  '/FC/DJI_20240418165053_0242_D copy.jpg',
  '/FC/DJI_20240418172456_0288_D.jpg',
  '/FC/DJI_20240418172931_0308_D.jpg',
  '/FC/DJI_20240418190545_0356_D.jpg',
  '/FC/DJI_20240418082855_0129_D.jpg',
  '/FC/DJI_20240418172703_0299_D.jpg',
  '/FC/DJI_20240418101259_0207_D.jpg',
  '/FC/DJI_20240418174825_0341_D.jpg',
  '/FC/DJI_20240418100436_0202_D.jpg',
  '/FC/DJI_20240418091018_0110_D copy.jpg',
  '/FC/DJI_20240418165852_0261_D.jpg',
  '/FC/DJI_20240418084657_0144_D copy.jpg',
  '/FC/DJI_20240418082739_0121_D.jpg',
  '/FC/DJI_20240418094216_0150_D.jpg',
  
  '/CDM/CDM_Carousel.jpg',
  '/CDM/CDM Aerial View V2.png',
  '/CDM/DJI_20250326114048_0040_D.jpg',
  '/CDM/CDM Entryway.jpg',
  '/CDM/viber_image_2026-03-24_15-55-50-546.jpg',
  '/CDM/viber_image_2026-03-24_15-55-47-004.jpg',
  '/CDM/viber_image_2026-03-24_15-55-48-773.jpg',
  
  '/DH/Daang Hari/DH_Carousel.jpg',
  '/DH/Daang Hari/83AB9953CC40B6A5458A207306C17644.jpg',
  '/DH/Daang Hari/136D626FBA60F5411D80E38665AF0A27.jpg',
  '/DH/Daang Hari/C70CE5FBD36DFDCB3BAE45B6E24A53C5.jpg',
  '/DH/Daang Hari/AEB23F77479DEADA07DA7965E4B482EC.jpg',
  '/DH/Daang Hari/D37FDCE4DA868FF151841F465F04A1CD.jpg',
  '/DH/Daang Hari/F10490913CCA7235DAF58BC4EBCF5808.jpg'
];
