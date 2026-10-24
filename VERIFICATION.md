# Verification record

Platform: React Native / Expo SDK 58 / TypeScript.

- Model unit tests: **13/13 passed**, run serially with Jest.
- Strict TypeScript check: **passed**.
- ESLint: **passed**, no errors or warnings.
- Production web export: **passed**, one Metro worker.
- iOS and Android Hermes bundle exports: **passed**, one Metro worker.
- Live Cloud Firestore: **passed** create/read, timestamp round trip, edit, completion, snapshot listener and delete checks.
- Browser UI: **passed** creation, form reset, editing name/assignee/due date, completion toggle, incomplete-first ordering, completed detail status, delete cancellation, confirmed deletion, navigation after deletion and empty-field validation.
- Final cloud data: two sample task documents in `tasks`; both date fields are Firestore timestamps. The temporary task created through the UI was deleted.

Firebase project: `arbeit-2e04e`, web app: `ArbeitRN`, database region: `me-central1` (Doha), free Spark plan. Approved test access is limited to `tasks` and expires November 23, 2026. The published rules match `firestore.rules`.

Screenshots are from the actual React Native web preview at mobile screen width. The web preview uses a YYYY-MM-DD text field; iOS and Android use the native date picker. Native runtime was not verified: the simulator was stopped to keep resource use low. Bundle exports are not signed native builds.

No polling, analytics, background jobs or animation libraries run in the app. One provider-level Firestore listener serves all screens and unsubscribes on unmount. `FlatList` virtualizes task rows. Metro uses one worker; Jest runs serially.

Evidence: `model-tests.txt`, `typecheck.txt`, `lint.txt`, `cloud-verification.txt`, `firestore-documents.json`, `web-export.txt` and `native-export.txt` in `evidence/`.
