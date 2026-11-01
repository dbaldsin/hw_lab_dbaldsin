export interface CarCoordinate {
  latitude: number;
  longitude: number;
}

export const defaultCarCoordinate: CarCoordinate = { latitude: 0, longitude: 0 };

// Validate stored data and reject the lab's (0, 0) unsaved sentinel.
export function isValidCoordinate(coordinate: unknown): coordinate is CarCoordinate {
  if (!coordinate || typeof coordinate !== 'object') return false;
  const { latitude, longitude } = coordinate as Partial<CarCoordinate>;
  return typeof latitude === 'number' && typeof longitude === 'number'
    && Number.isFinite(latitude) && Number.isFinite(longitude)
    && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
    && (latitude !== 0 || longitude !== 0);
}

// Display both components consistently to six decimal places.
export function formatCoordinate(coordinate: CarCoordinate): string {
  return `(${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)})`;
}
