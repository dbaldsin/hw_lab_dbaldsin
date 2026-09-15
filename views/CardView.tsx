import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from '../styles';
import { RootStackParamList } from '../types';
import { useCardViewModel } from '../viewModels/useCardViewModel';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function CardView() {
  const { flashcard, drawNewCard } = useCardViewModel();
  const navigation = useNavigation<NavProp>();

  useFocusEffect(
    useCallback(() => {
      drawNewCard();
    }, [drawNewCard]),
  );

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        accessibilityHint="Opens the definition of this Rails command"
        accessibilityRole="button"
        accessibilityLabel={`Show definition for ${flashcard.command}`}
        activeOpacity={0.78}
        onPress={() => navigation.navigate('Definition', { definition: flashcard.definition })}
        style={styles.card}
      >
        <Text style={styles.cardText}>{flashcard.command}</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Tap the card to reveal its definition</Text>
    </View>
  );
}
