# Firebase setup

The included `config/firebase.public.json` identifies the Arbeit project (`arbeit-2e04e`) and registered web app ArbeitRN. The app and seed script use it by default. `.env` is optional and only needed to switch projects. No service account or admin credential is included.

To connect a different Firebase project:

1. In Firebase Console, create a free Spark project named **Arbeit**.
2. Register a **web app** named **ArbeitRN**. Expo uses Firebase's JavaScript SDK.
3. Create a **Cloud Firestore Standard** database. The lab specifies temporary test mode; store only disposable lab tasks in a database with public test access.
4. Copy `.env.example` to `.env`, then paste the web app's Firebase configuration values into the matching variables. These are client project identifiers, not a service account key. Never add an admin credential to a mobile app.
5. Run `node scripts/seed.mjs` to create two sample task documents in the `tasks` collection. Their date fields are Firestore timestamps, not strings. Rerunning the script does not overwrite existing sample documents.
6. Run `npm start`. Restart Metro after changing `.env` values.
7. For a live check, run `node scripts/seed.mjs --verify`.

`firestore.rules` contains a lab-only test rule restricted to the `tasks` collection and expiring November 23, 2026. Rules are not applied automatically by the app. Check the actual console rules if reads or writes fail later.

A local Firestore emulator is supported explicitly through `EXPO_PUBLIC_USE_FIRESTORE_EMULATOR=true` and port 8088. It is not a replacement for the lab's required cloud setup. Keep that setting false for submission.

On a physical phone, a local emulator would need the development computer's reachable LAN address rather than `127.0.0.1`.

Reference: [Expo Firebase guide](https://docs.expo.dev/guides/using-firebase/) and [Firestore quickstart](https://firebase.google.com/docs/firestore/quickstart).
