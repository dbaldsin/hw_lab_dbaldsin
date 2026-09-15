# RailsCards (React Native)

**Platform:** React Native with Expo and TypeScript.

RailsCards is a two-screen flashcard app for commonly used Ruby on Rails commands. Tap a command card to reveal its definition; returning to the home screen draws another random card.

## Run it

```bash
npm install
npm start
```

Run the model tests with:

```bash
npm test
```

## Project structure

- `models/`: `Flashcard` and the 22-card `Deck`
- `viewModels/`: reactive card selection hook
- `views/`: command and definition screens
- `__tests__/`: Jest tests for deck behavior
