/** A task uses JavaScript Dates; Firestore timestamps stay at the storage boundary. */
export interface TaskItem {
  id?: string;
  name: string;
  assignedTo: string;
  dueDate: Date;
  dateAdded: Date;
  completed: boolean;
}

/** Require a meaningful name and assignee, ignoring surrounding whitespace. */
export function isValidTask(name: string, assignedTo: string): boolean {
  return name.trim().length > 0 && assignedTo.trim().length > 0;
}
/** Compare task names alphabetically without changing either task. */
export function compareTasksByName(a: TaskItem, b: TaskItem): number {
  return a.name.localeCompare(b.name);
}
/** Compare due dates in chronological order using millisecond values. */
export function compareTasksByDueDate(a: TaskItem, b: TaskItem): number {
  return a.dueDate.getTime() - b.dueDate.getTime();
}
/** Compare editable identity fields; completion, document ID and creation date are ignored. */
export function areTasksEqual(a: TaskItem, b: TaskItem): boolean {
  return a.name === b.name && a.assignedTo === b.assignedTo && a.dueDate.getTime() === b.dueDate.getTime();
}
/** Keep unfinished work first, then order each group by its due date. */
export function compareTasksForList(a: TaskItem, b: TaskItem): number {
  return Number(a.completed) - Number(b.completed) || compareTasksByDueDate(a, b) || compareTasksByName(a, b);
}
