# Lab 07 — Arbeit (React Native)

**Dion Baldsing · dbaldsin · React Native / Expo / TypeScript**

Task manager for Lab 07. The included public client configuration points to Firebase project `arbeit-2e04e`; no account login or local secrets file is needed to run the lab app. Uses Firebase's JavaScript SDK and Cloud Firestore, React Context for shared state, two bottom tabs, and a nested native stack for task details.

## Run

```sh
npm ci
npm start
```

Open in Expo Go for SDK 58 on iOS/Android. For a lightweight desktop preview, run `npm run web`. Native platforms use the native date picker; the web preview accepts a `YYYY-MM-DD` date.

## Features

- Create a task with a required name, assignee and due date.
- Open details to edit task fields and completion status.
- Toggle completion directly from the list.
- Confirm before deleting; cancellation preserves the task.
- Show unfinished tasks first and sort each group by due date.
- Receive real-time updates through one provider-level Firestore subscription.
- Store `dueDate` and `dateAdded` as Firestore timestamps; convert them to JavaScript Dates on reads.
- Show loading, empty, missing-task and connection-error states.
- Preserve a form draft if validation or a write fails; prevent duplicate Save submissions.

## Project organization

| Path | Responsibility |
| --- | --- |
| `models/TaskItem.ts` | Model, validation, equality and ordering; no React or Firebase imports |
| `config/firebase.ts` | Firebase initialization and optional local emulator connection |
| `viewModels/TasksContext.tsx` | One listener, timestamp conversion and shared CRUD methods |
| `viewModels/taskFormHelpers.ts` | Reused date, validation and delete-confirmation behavior |
| `views/TasksView.tsx`, `TaskRowView.tsx` | Virtualized task list and completion control |
| `views/NewTaskView.tsx`, `TaskDetailsView.tsx` | Local drafts and persistence actions |
| `views/TaskDateField.tsx` | Shared platform-specific date input |
| `App.tsx`, `types.ts` | Typed React Navigation tabs and task-details stack |
| `__tests__/taskItem.test.ts` | 13 deterministic model tests, including the lab's nine cases |
| `scripts/seed.mjs` | Idempotent sample data seeding and optional live CRUD verification |

## Verification

```sh
npm test -- --runInBand
npm run typecheck
npm run lint
node scripts/seed.mjs --verify
```

The first three commands run locally. The final command requires a configured Firestore project and removes only its own temporary verification document. See `VERIFICATION.md` for the actual checks performed.

## Resource use

The app maintains one real-time listener with cleanup on unmount, uses `FlatList` instead of rendering an unbounded scroll view of rows, and performs writes only after an explicit action. No polling, analytics, background services, image processing or animation packages are included. For development, use one Metro worker and run Jest serially; avoid an emulator when a browser or physical phone is sufficient.

## Submission

Repository: https://github.com/dbaldsin/hw_lab_dbaldsin/tree/hw_lab7_Arbeit

Branch: `hw_lab7_Arbeit`

Platform: **React Native**. Screenshots and the submission report belong in the sibling submission package. The repository must also be shared with the assigned CA; `dbaldsin` is the repository owner's account, not a second collaborator.
