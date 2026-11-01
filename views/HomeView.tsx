import { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocation } from '../viewModels/LocationContext';
import { isValidCoordinate, formatCoordinate } from '../models/CarCoordinate';
import type { RootStackParamList } from '../types';

// Offer save and find actions with loading and permission feedback.
export default function HomeView({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { coordinate, loading, saveCurrentLocation } = useLocation();
  const [busy, setBusy] = useState(false);
  const hasLocation = isValidCoordinate(coordinate);

  // Preserve the previous saved spot if GPS or persistence fails.
  async function onSave() {
    if (busy || loading) return;
    setBusy(true);
    try {
      const next = await saveCurrentLocation();
      Alert.alert('Location Saved', `Your car is at:\n${formatCoordinate(next)}\n\nTap "Where's My Car?" to view it on the map.`);
    } catch (error) {
      Alert.alert('Location Error', error instanceof Error ? error.message : 'Unable to save your location. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // The destination reads the current coordinate directly from context.
  function onFind() {
    navigation.navigate('Map');
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.titleBlock}>
        <Ionicons name="car-sport" size={72} color="#007AFF" accessible={false} />
        <Text style={styles.title}>Find My Car</Text>
        <Text style={styles.subtitle} accessibilityLiveRegion="polite">
          {loading ? 'Loading saved location…' : hasLocation ? 'Location Saved' : 'Save your spot before you walk away.'}
        </Text>
        {hasLocation && <Text style={styles.coordinate}>{formatCoordinate(coordinate)}</Text>}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Here's My Car"
        accessibilityState={{ disabled: loading || busy, busy }}
        style={[styles.button, styles.primary, (loading || busy) && styles.disabled]}
        onPress={onSave} disabled={loading || busy}>
        {busy || loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="car" size={22} color="#fff" accessible={false} />}
        <Text style={styles.buttonText}>{busy ? 'Saving Location…' : "Here's My Car"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !hasLocation || loading || busy }}
        style={[styles.button, hasLocation && !busy && !loading ? styles.success : styles.disabled]}
        onPress={onFind} disabled={!hasLocation || loading || busy}>
        <Ionicons name="map" size={22} color="#fff" accessible={false} />
        <Text style={styles.buttonText}>Where's My Car?</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 20, backgroundColor: '#F7F9FC' },
  titleBlock: { alignItems: 'center', marginBottom: 20, gap: 10 },
  title: { fontSize: 34, fontWeight: 'bold', color: '#17212F' },
  subtitle: { fontSize: 15, color: '#326548', textAlign: 'center' },
  coordinate: { fontSize: 13, color: '#4B5563' },
  button: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 10, gap: 8 },
  primary: { backgroundColor: '#0066D6' },
  success: { backgroundColor: '#24823D' },
  disabled: { backgroundColor: '#6B7280' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
