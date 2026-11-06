# Lab 09 verification — 6 November 2026

Student: Dion Baldsing (`dbaldsin`)

## Completed checks

- `npm test`: **14 tests passed**, including the nine required reducer tests, all five timed-out rounds through GameOver/restart, state immutability, late callbacks, confidence boundary, empty predictions and exact alias matching.
- `npm run typecheck`: passed, strict TypeScript.
- `npm run lint`: passed, no warnings or errors.
- Expo Go SDK 58 on one iPhone 17 Pro simulator, iOS 26.3: bundled and launched the final app. The simulator message, first target and paused ten-second clock were visually inspected.
- A temporary runtime probe loaded MobileNet in Expo Go, classified one synthetic 224 × 224 RGB tensor, and logged `LAB09_RUNTIME_CHECK {"backend":"rn-webgl","predictions":3,"finite":true}`. Its tensor and model were disposed. This validates model download and native TensorFlow execution, **not** real-object recognition. The probe was removed from the submitted App.tsx.
- `npx expo-doctor`: **19/20 checks passed**. The remaining check flags `react-native-fs` as unmaintained/untested on the New Architecture. It is explicitly included by the lab and imported lazily only by TensorFlow's optional bundled-resource loader. This app uses Expo FileSystem and remote model loading instead. The warning has not been hidden.
- Dependency audit: the production dependency graph reports moderate advisories in Expo CLI/fingerprint's `glob` and `minimatch` dependency chain. No forced SDK upgrades were applied. This is a coursework app, not a production security certification.

## Screenshot and environment limitation

`evidence/screenshots/01-simulator.png` is a real `xcrun simctl io … screenshot` capture, not a mockup. The installed iOS runtime has a missing emoji font at `System/Library/Fonts/Core/AppleColorEmoji.ttc`; CoreText logs confirm fallback to LastResort. As a result the target emoji appears as a missing-glyph box in this simulator. The app stores the correct Unicode emoji and also shows the target as text. No system font files were changed or large fonts added to the app.

The simulator deliberately performs no camera capture or recurring inference, and its countdown waits. No Found/NEXT/game-over screenshot has been fabricated. Those state transitions are covered by reducer tests.

## Physical-phone acceptance check still required

A real phone was not available to this session. As stated in the lab PDF, the simulator cannot test real-world camera recognition. On a physical phone using Expo Go SDK 58:

1. Run `npm ci` then `npm start`; scan the QR code on the same Wi-Fi.
2. Grant camera permission; check that the timer waits until the model and camera are ready.
3. Point at a laptop, phone, pen, book and backpack in sequence; confirm a sufficiently confident match displays FOUND and NEXT. A timeout should display NOT FOUND and NEXT.
4. Continue after the fifth target; verify GAME OVER and tap to restart.
5. Background the app during a search; verify camera processing/countdown pause and resume on return.
6. If camera permission is denied, use Allow camera or Open Settings. If a model download fails, restore connectivity and tap Retry.

## Resource use

Only one simulator was booted. Metro used one worker; Jest ran serially. One synthetic inference was used for the runtime check. The final simulator screen does not load MobileNet. Development services and the simulator were stopped after evidence capture. Optional bonus features and native release builds were omitted.

## Reference documentation consulted

- Expo SDK 58 camera: https://docs.expo.dev/versions/v58.0.0/sdk/camera/
- Expo SDK 58 image manipulation: https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator/
- Expo SDK 58 files: https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/
- React Native AppState: https://reactnative.dev/docs/appstate
- TensorFlow React Native: https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native
