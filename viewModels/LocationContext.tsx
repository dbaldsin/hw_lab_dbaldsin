import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultCarCoordinate, isValidCoordinate, type CarCoordinate } from '../models/CarCoordinate';

const STORAGE_KEY = '@FindMyCar:coordinate';
type LocationContextValue = {
  coordinate: CarCoordinate;
  loading: boolean;
  saveCurrentLocation: () => Promise<CarCoordinate>;
  clearLocation: () => Promise<void>;
};
const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// Own the persistent coordinate so both screens read the same value.
export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinate, setCoordinate] = useState<CarCoordinate>(defaultCarCoordinate);
  const [loading, setLoading] = useState(true);

  // Restore storage before enabling save to avoid a startup race.
  useEffect(() => {
    // Validate persisted JSON and report unreadable data without deleting it.
    async function loadLocation() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null) {
          const saved: unknown = JSON.parse(json);
          if (!isValidCoordinate(saved)) throw new Error('Invalid saved coordinate');
          setCoordinate(saved);
        }
      } catch {
        Alert.alert('Storage Error', 'Your saved location could not be loaded. Please save your car again.');
      } finally {
        setLoading(false);
      }
    }
    void loadLocation();
  }, []);

  // Request one GPS fix and change shared state only after storage succeeds.
  async function saveCurrentLocation(): Promise<CarCoordinate> {
    if (!(await Location.hasServicesEnabledAsync())) {
      throw new Error('Location services are disabled. Please enable them in Settings.');
    }
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await Location.requestForegroundPermissionsAsync());
    }
    if (status !== 'granted') {
      throw new Error('Location access denied. Please enable it in Settings.');
    }
    const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const next = { latitude: fix.coords.latitude, longitude: fix.coords.longitude };
    if (!isValidCoordinate(next)) throw new Error('No valid location received. Please try again.');
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCoordinate(next);
    return next;
  }

  // Remove storage before resetting the shared coordinate.
  async function clearLocation(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setCoordinate(defaultCarCoordinate);
  }

  return (
    <LocationContext.Provider value={{ coordinate, loading, saveCurrentLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

// Require a provider so screens cannot silently use unshared state.
export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used inside a LocationProvider');
  return context;
}
