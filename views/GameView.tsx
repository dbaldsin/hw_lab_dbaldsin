import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';
import { useGameViewModel } from '../viewModels/useGameViewModel';
import CustomCamera from './CustomCamera';

export default function GameView() {
  const vm = useGameViewModel();
  const emoji = emojiObjects[vm.currentLevel].emoji;
  const gameOver = vm.emojiStatus === EmojiSearchStatus.GameOver;
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {gameOver ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Game over. Restart game" style={[styles.fullscreen, styles.gameOver]} onPress={vm.restart}>
          <Text style={styles.heading}>GAME OVER</Text><Text style={styles.subtitle}>All five rounds complete</Text><Text style={styles.subtitle}>Tap to restart</Text>
        </Pressable>
      ) : vm.showNext ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Next emoji" style={[styles.fullscreen, styles.next]} onPress={vm.startNext}>
          <Text style={styles.heading}>NEXT</Text><Text style={styles.subtitle}>Tap to continue</Text>
        </Pressable>
      ) : !vm.active ? <View style={styles.container} /> : (
        <CustomCamera key={vm.currentLevel} emojiNames={emojiObjects[vm.currentLevel].emojiNames}
          onEmojiFound={vm.foundEmoji} onTensorLoaded={vm.setTensorLoaded} />
      )}
      {!gameOver && <View pointerEvents="none" style={styles.info}>
        <Text style={styles.level}>EMOJI HUNTER · {vm.currentLevel + 1} / {emojiObjects.length}</Text>
        {vm.emojiStatus === EmojiSearchStatus.Searching && <Text style={styles.timer}>Time Remaining: {vm.timeRemaining}</Text>}
        <Text style={styles.target}>Find: {emojiObjects[vm.currentLevel].emojiNames[0]}</Text>
        <Text accessibilityLiveRegion="polite" style={styles.emoji}>{emoji}{vm.emojiStatus === EmojiSearchStatus.Found ? ' FOUND!' : vm.emojiStatus === EmojiSearchStatus.NotFound ? ' NOT FOUND' : ''}</Text>
      </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  fullscreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  next: { backgroundColor: '#166534' },
  gameOver: { backgroundColor: '#b91c1c' },
  heading: { color: '#fff', fontSize: 44, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#fff', fontSize: 20, marginTop: 12, textAlign: 'center' },
  info: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', padding: 16 },
  level: { color: '#d1d5db', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  target: { color: '#fff', fontSize: 18, marginTop: 6 },
  timer: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  emoji: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginTop: 6 },
});
