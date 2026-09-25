import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import type { BottomBarIconProps } from '../types';

export default function BottomBarIcon({ iconName, size, label, onPress, disabled = false }: BottomBarIconProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled && styles.pressed]}
      testID={`browser-${label.toLowerCase()}`}
    >
      <Ionicons name={iconName} size={size} color={disabled ? '#a4adba' : '#1976d2'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24 },
  pressed: { backgroundColor: '#eaf3ff' },
});
