import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LocationProvider } from './viewModels/LocationContext';
import HomeView from './views/HomeView';
import MapViewScreen from './views/MapView';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Share the saved coordinate across both screens.
export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeView} options={{ title: 'Find My Car' }} />
            <Stack.Screen name="Map" component={MapViewScreen} options={{ title: 'Map View' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
