import { gameReducer, initialGameState, ROUND_DURATION, GameState } from '../viewModels/gameReducer';
import { EmojiSearchStatus as Status, emojiObjects, matchesEmoji } from '../models/Emoji';

describe('gameReducer', () => {
  test('initial state is Searching at level 0 with full time', () => {
    expect(initialGameState).toEqual({ currentLevel: 0, timeRemaining: ROUND_DURATION, emojiStatus: Status.Searching, showNext: false });
  });
  test('tick decrements time while Searching', () => {
    expect(gameReducer(initialGameState, { type: 'tick' })).toEqual({ ...initialGameState, timeRemaining: 9 });
  });
  test('tick at 1 second marks NotFound and shows Next', () => {
    expect(gameReducer({ ...initialGameState, timeRemaining: 1 }, { type: 'tick' })).toEqual({ ...initialGameState, timeRemaining: 0, emojiStatus: Status.NotFound, showNext: true });
  });
  test('tick is a no-op when not Searching', () => {
    const state = { ...initialGameState, emojiStatus: Status.Found };
    expect(gameReducer(state, { type: 'tick' })).toBe(state);
  });
  test('foundEmoji flips to Found and shows Next', () => {
    expect(gameReducer(initialGameState, { type: 'foundEmoji' })).toEqual({ ...initialGameState, emojiStatus: Status.Found, showNext: true });
  });
  test('foundEmoji is ignored if not Searching', () => {
    const state = { ...initialGameState, emojiStatus: Status.NotFound };
    expect(gameReducer(state, { type: 'foundEmoji' })).toBe(state);
  });
  test('nextEmoji advances the level and resets the round', () => {
    const state = { ...initialGameState, emojiStatus: Status.Found, showNext: true, timeRemaining: 3 };
    expect(gameReducer(state, { type: 'nextEmoji' })).toEqual({ ...initialGameState, currentLevel: 1 });
  });
  test('nextEmoji at the last level transitions to GameOver', () => {
    const state = { ...initialGameState, currentLevel: emojiObjects.length - 1, emojiStatus: Status.Found };
    expect(gameReducer(state, { type: 'nextEmoji' }).emojiStatus).toBe(Status.GameOver);
  });
  test('restart returns to the initial state', () => {
    const state: GameState = { currentLevel: 3, timeRemaining: 5, emojiStatus: Status.GameOver, showNext: false };
    expect(gameReducer(state, { type: 'restart' })).toEqual(initialGameState);
  });
  test('all five timed-out rounds finish and restart', () => {
    let state = initialGameState;
    for (let level = 0; level < emojiObjects.length; level++) {
      expect(state.currentLevel).toBe(level);
      for (let second = 0; second < ROUND_DURATION; second++) state = gameReducer(state, { type: 'tick' });
      expect(state.emojiStatus).toBe(Status.NotFound);
      state = gameReducer(state, { type: 'nextEmoji' });
    }
    expect(state.emojiStatus).toBe(Status.GameOver);
    expect(gameReducer(state, { type: 'tick' })).toBe(state);
    expect(gameReducer(state, { type: 'foundEmoji' })).toBe(state);
    expect(gameReducer(state, { type: 'nextEmoji' })).toBe(state);
    expect(gameReducer(state, { type: 'restart' })).toEqual(initialGameState);
  });
  test('found stops ticks without mutating the previous state', () => {
    const before = { ...initialGameState };
    const found = gameReducer(before, { type: 'foundEmoji' });
    expect(gameReducer(found, { type: 'tick' })).toBe(found);
    expect(before).toEqual(initialGameState);
  });
});

describe('MobileNet alias matching', () => {
  test('matches exact comma-separated aliases, case insensitively', () => {
    expect(matchesEmoji([{ className: 'Laptop, notebook computer', probability: 0.8 }], emojiObjects[0].emojiNames)).toBe(true);
  });
  test('rejects penguin for pen and notebook for book', () => {
    expect(matchesEmoji([{ className: 'king penguin', probability: 0.9 }], emojiObjects[2].emojiNames)).toBe(false);
    expect(matchesEmoji([{ className: 'notebook computer', probability: 0.9 }], emojiObjects[3].emojiNames)).toBe(false);
  });
  test('requires confidence strictly greater than 0.2', () => {
    expect(matchesEmoji([{ className: 'laptop', probability: 0.2 }], emojiObjects[0].emojiNames)).toBe(false);
    expect(matchesEmoji([{ className: 'laptop', probability: 0.201 }], emojiObjects[0].emojiNames)).toBe(true);
    expect(matchesEmoji([], emojiObjects[0].emojiNames)).toBe(false);
  });
});
