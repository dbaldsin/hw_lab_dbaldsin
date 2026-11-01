import { defaultCarCoordinate, isValidCoordinate, formatCoordinate, type CarCoordinate } from '../models/CarCoordinate';

// Cover the six required behaviors plus validation of untrusted stored data.
describe('CarCoordinate', () => {
  // The default represents an unsaved parking spot.
  test('defaultCarCoordinate is (0, 0)', () => {
    expect(defaultCarCoordinate).toEqual({ latitude: 0, longitude: 0 });
  });
  // The sentinel must keep the map action disabled.
  test('isValidCoordinate returns false for the default', () => {
    expect(isValidCoordinate(defaultCarCoordinate)).toBe(false);
  });
  // Either nonzero component is enough, including the equator and prime meridian.
  test('isValidCoordinate returns true when either component is non-zero', () => {
    expect(isValidCoordinate({ latitude: 40.4446, longitude: -79.9454 })).toBe(true);
    expect(isValidCoordinate({ latitude: 40.4446, longitude: 0 })).toBe(true);
    expect(isValidCoordinate({ latitude: 0, longitude: -79.9454 })).toBe(true);
  });
  // Coordinates use predictable rounding for the saved alert and map card.
  test('formatCoordinate produces six-decimal output', () => {
    const c: CarCoordinate = { latitude: 40.4446443, longitude: -79.945424 };
    expect(formatCoordinate(c)).toBe('(40.444644, -79.945424)');
  });
  // Short values are padded rather than changing display precision.
  test('formatCoordinate pads short values to six decimals', () => {
    expect(formatCoordinate({ latitude: 1, longitude: 2 })).toBe('(1.000000, 2.000000)');
  });
  // Persistence must retain both numeric components without loss.
  test('round-trips cleanly through JSON', () => {
    const original: CarCoordinate = { latitude: 40.4446, longitude: -79.9454 };
    const restored: unknown = JSON.parse(JSON.stringify(original));
    expect(restored).toEqual(original);
    expect(isValidCoordinate(restored)).toBe(true);
  });
  // Bad storage must never reach the native map as an invalid coordinate.
  test('rejects malformed and out-of-range coordinates', () => {
    for (const value of [null, {}, '40,-79', { latitude: '40', longitude: -79 },
      { latitude: NaN, longitude: 1 }, { latitude: 1, longitude: Infinity },
      { latitude: 91, longitude: 1 }, { latitude: 1, longitude: -181 }]) {
      expect(isValidCoordinate(value)).toBe(false);
    }
    expect(isValidCoordinate({ latitude: -90, longitude: 180 })).toBe(true);
  });
});
