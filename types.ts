import Ionicons from '@expo/vector-icons/Ionicons';

export type BottomBarIconProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  size: number;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};
