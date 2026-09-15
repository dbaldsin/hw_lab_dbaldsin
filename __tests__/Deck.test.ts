import { Deck } from '../models/Deck';

describe('Deck', () => {
  test('deck has 22 cards', () => {
    expect(new Deck().cards).toHaveLength(22);
  });

  test('every card has a non-empty command and definition', () => {
    for (const card of new Deck().cards) {
      expect(card.command.length).toBeGreaterThan(0);
      expect(card.definition.length).toBeGreaterThan(0);
    }
  });

  test('drawRandomCard returns a card that is in the deck', () => {
    const deck = new Deck();
    const card = deck.drawRandomCard();

    expect(deck.cards.some((item) => item.command === card.command)).toBe(true);
  });
});
