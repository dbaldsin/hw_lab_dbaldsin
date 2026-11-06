# Lab 09 — Emoji Hunter (React Native)

Dion Baldsing · **dbaldsin** · Expo SDK 58 · TypeScript

Find five objects with the rear camera: laptop, phone, pen, book and backpack. Each round lasts ten seconds. MobileNet runs on the phone and accepts exact comma-separated label aliases above 20% confidence. Found and timed-out rounds show NEXT; after the fifth round, tap GAME OVER to restart.

## Run on a phone

```sh
npm ci
npm start
```

Open the project in **Expo Go for SDK 58** on a physical iOS or Android phone, using the same Wi-Fi network as the computer. Allow camera access. An internet connection is required to download MobileNet when the app session first starts. Frames are classified locally; there is no photo-upload service. The model is reused between rounds.

A simulator cannot capture real objects. It shows an explicit camera-unavailable message and keeps the clock paused. This is not a simulated classifier. A native development build can also be used; the lab-required `react-native-fs` dependency is only used by TensorFlow's optional bundled-model loader, not by this app's remote-model loading path.

## Structure

- `models/Emoji.ts`: five emoji objects, aliases and exact-label matching.
- `viewModels/gameReducer.ts`: pure state machine, ten-second rounds and restart.
- `viewModels/useGameViewModel.ts`: reducer wrapper and foreground/readiness-gated timer.
- `views/CustomCamera.tsx`: camera permissions, cached MobileNet, sequential frame capture and classification, retry, tensor disposal and temporary-file cleanup.
- `views/GameView.tsx`: camera, result/NEXT and GAME OVER screens.
- `__tests__/gameReducer.test.ts`: all nine lab cases plus complete-game and alias edge cases.

## Checks

```sh
npm test
npm run typecheck
npm run lint
npx expo-doctor
```

Jest runs serially and Metro uses one worker. The capture loop waits one second after processing each frame, never overlaps classifications, and stops when the camera unmounts or the app leaves the foreground. The countdown starts only after both the camera and model are ready. Failed model loading and camera errors are shown with a retry action.

## Submission links

- Repository: https://github.com/dbaldsin/hw_lab_dbaldsin
- Branch: https://github.com/dbaldsin/hw_lab_dbaldsin/tree/hw_lab9_EmojiHunter
- Repository name: `hw_lab_dbaldsin`
- Branch name: `hw_lab9_EmojiHunter`

See `evidence/VERIFICATION.md` for actual validation and remaining physical-device checks. Optional bonus features were omitted.
