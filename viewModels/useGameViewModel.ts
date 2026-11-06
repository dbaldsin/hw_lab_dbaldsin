import { useCallback, useEffect, useReducer, useState } from 'react';
import { AppState } from 'react-native';
import { EmojiSearchStatus } from '../models/Emoji';
import { gameReducer, initialGameState } from './gameReducer';

export function useGameViewModel() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [tensorLoaded, setTensorLoaded] = useState(false);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!active || !tensorLoaded || state.emojiStatus !== EmojiSearchStatus.Searching) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [active, tensorLoaded, state.emojiStatus, state.currentLevel]);
  return {
    ...state, tensorLoaded, setTensorLoaded, active,
    foundEmoji: useCallback(() => dispatch({ type: 'foundEmoji' }), []),
    startNext: () => { setTensorLoaded(false); dispatch({ type: 'nextEmoji' }); },
    restart: () => { setTensorLoaded(false); dispatch({ type: 'restart' }); },
  };
}
