import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BrowserView from './BrowserView';

export default function AppView() {
  const [fontsLoaded] = useFonts(Ionicons.font);
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <BrowserView />
    </SafeAreaProvider>
  );
}
