import { SurveyorLine, SurveyorBearing } from './types';

// Convert degrees to radians
const toRad = (value: number) => (value * Math.PI) / 180;
// Convert radians to degrees
const toDeg = (value: number) => (value * 180) / Math.PI;

const R = 6378137; // Earth’s equatorial radius in meters

/**
 * Parses SurveyorBearing (e.g. S 62 54 E) to a 360-degree Azimuth.
 * North = 0, East = 90, South = 180, West = 270.
 */
export const parseBearing = (bearing: SurveyorBearing): number => {
  const decimalDegrees = bearing.degrees + bearing.minutes / 60;
  
  if (bearing.direction1 === 'N') {
    if (bearing.direction2 === 'E') {
      return decimalDegrees;
    } else { // 'W'
      return 360 - decimalDegrees;
    }
  } else { // 'S'
    if (bearing.direction2 === 'E') {
      return 180 - decimalDegrees;
    } else { // 'W'
      return 180 + decimalDegrees;
    }
  }
};

/**
 * Calculates a new GPS coordinate based on a starting coordinate, distance, and bearing (azimuth).
 * Uses the Haversine formula for spherical calculations.
 */
export const calculateDestination = (startLat: number, startLng: number, distance: number, azimuth: number): [number, number] => {
  const lat1 = toRad(startLat);
  const lon1 = toRad(startLng);
  const brng = toRad(azimuth);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
    Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
    Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
  );

  return [toDeg(lat2), toDeg(lon2)];
};

/**
 * Traces a list of metes & bounds lines into an array of coordinates, starting from a given anchor point.
 */
export const generateCoordinatesFromLines = (startPoint: [number, number], lines: SurveyorLine[]): [number, number][] => {
  const coordinates: [number, number][] = [startPoint];
  let currentPoint = startPoint;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const azimuth = parseBearing(line.bearing);
    const nextPoint = calculateDestination(currentPoint[0], currentPoint[1], line.distance_m, azimuth);
    coordinates.push(nextPoint);
    currentPoint = nextPoint;
  }

  return coordinates;
};
