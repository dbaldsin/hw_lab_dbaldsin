# Actual screenshot evidence

These images were captured from the React Native web preview at mobile screen width, backed by the live Cloud Firestore project. They are not native simulator screenshots.

1. New Task form before entry.
2. Two tasks loaded from Firestore.
3. New task fields and chosen due date.
4. Created task appears in the shared list.
5. Local draft with edited name, assignee and due date.
6. Edited values appear after Save.
7. Completed task moves after unfinished tasks and uses a checkmark/strikethrough.
8. Completed status in Task Details.
9. Delete confirmation dialog; Cancel was checked before confirming deletion.
10. Published collection-scoped Firestore test rules.
11. List after deleting the temporary task; two sample tasks remain.
12. Empty-field validation blocks saving.

Native platforms use the native date picker. The web preview displays and edits the calendar date as YYYY-MM-DD. The final verification logs are in `evidence/`.
