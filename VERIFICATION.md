# Final verification — Lab 08

Date: November 1, 2026 (Asia/Qatar)  
Andrew ID: dbaldsin

## Source checks

- `npm run typecheck`: passed with no TypeScript errors.
- `npm test -- --watch=false`: 1 suite passed, 7 tests passed, 0 snapshots.
- The six specified model tests are present; the seventh checks malformed, non-finite, and out-of-range coordinates.
- `package.json` dependencies match the lockfile; every locked package has registry resolution and integrity metadata. No absolute paths or local dependency links occur in the lockfile.
- All authored functions, effects, and test callbacks have explanatory comments.
- Final source was reviewed against Parts 0–5 of the supplied lab handout.

## Actual simulator checks

Device: iPhone 17 Pro, iOS 26.3, Expo Go 58.0.4. One simulator only.

1. Fresh home screen shows the save action and disabled find action. See `01-home-unsaved.png`.
2. Denying foreground location permission shows “Location access denied. Please enable it in Settings.” See `02-permission-denied.png`.
3. With simulator location permission granted, saving the lab's CMU coordinate `(40.444644, -79.945424)` shows the success alert and enables Find. See `03-location-saved.png`.
4. Find opens the native Apple map with loaded map tiles, the custom red car marker and “Your Car” label, and the matching coordinate card. Moving the simulated user to `(40.446000, -79.943500)` moves the blue dot while the car remains saved at its original coordinate. See `04-map-car-and-user.png`.
5. Terminating and reopening Expo Go restores `(40.444644, -79.945424)` and keeps Find enabled without another save. See `05-persisted-after-relaunch.png`.

All screenshots are unedited simulator captures. Coordinates are simulated examples, not the student's actual location.

## Scope and limitations

- No physical device, Android emulator, or standalone native build was tested. The required iOS Expo Go flow was verified.
- A clean dependency installation in a second directory was not run because this Mac was nearly out of disk space. Tests used installed SDK 58 packages; the submission includes a registry-only lockfile for `npm ci`.
- Expo's compatibility checker recommends newer patch releases for Expo, React Native, screens, status-bar, and Jest Expo. The pinned SDK 58 versions above passed the checks and simulator flow; a patch upgrade was not completed because of disk pressure.
- Optional distance, connecting polyline, and Clear Location UI are omitted. The lab's `clearLocation()` operation is implemented in the context.
- Map tiles need network access. The lab's `(0, 0)` sentinel is treated as unsaved.
- Only one Metro worker was used. The inspector proxy was disabled to prevent automatic desktop DevTools downloads. The server and simulator were stopped after capture.
