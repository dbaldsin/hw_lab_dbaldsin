import { TaskItem, isValidTask, compareTasksByName, compareTasksByDueDate, areTasksEqual, compareTasksForList } from '../models/TaskItem';
const fixedDate = new Date('2026-01-15T00:00:00Z');
/** Create deterministic model fixtures with only the intended fields changed. */
function sample(overrides: Partial<TaskItem> = {}): TaskItem {
  return { name: 'Write lab', assignedTo: 'Prof H', dueDate: fixedDate, dateAdded: fixedDate, completed: false, ...overrides };
}
/** Verify the shared required-field validation used by both forms. */
describe('isValidTask', function validationSuite() {
  /** Reject an empty task name. */
  test('rejects an empty name', function emptyName() { expect(isValidTask('', 'someone')).toBe(false); });
  /** Reject an empty assignee. */
  test('rejects an empty assignee', function emptyAssignee() { expect(isValidTask('something', '')).toBe(false); });
  /** Reject spaces, tabs and line breaks without actual content. */
  test('rejects whitespace-only fields', function whitespace() { expect(isValidTask(' \t\n', 'someone')).toBe(false); expect(isValidTask('something', '  ')).toBe(false); });
  /** Accept meaningful text even with surrounding spaces. */
  test('accepts both fields present', function valid() { expect(isValidTask(' something ', ' someone ')).toBe(true); });
});
/** Verify alphabetical and chronological ordering independently. */
describe('comparators', function comparatorsSuite() {
  /** Check the actual order, rather than only the comparator sign. */
  test('compareTasksByName sorts alphabetically', function alphabetical() {
    const list = [sample({ name: 'Cherry' }), sample({ name: 'Apple' }), sample({ name: 'Banana' })].sort(compareTasksByName);
    // Extract names to make the expected ordering readable.
    expect(list.map(function nameOf(task) { return task.name; })).toEqual(['Apple', 'Banana', 'Cherry']);
  });
  /** Check dates across month boundaries. */
  test('compareTasksByDueDate sorts earliest first', function chronological() {
    const list = [sample({ name: 'A', dueDate: new Date('2026-03-01') }), sample({ name: 'B', dueDate: new Date('2026-01-01') }), sample({ name: 'C', dueDate: new Date('2026-02-01') })].sort(compareTasksByDueDate);
    // Read back task identities after chronological sorting.
    expect(list.map(function nameOf(task) { return task.name; })).toEqual(['B', 'C', 'A']);
  });
  /** Equal keys must compare equally. */
  test('equal keys return zero', function ties() { expect(compareTasksByName(sample(), sample())).toBe(0); expect(compareTasksByDueDate(sample(), sample())).toBe(0); });
  /** Completed tasks follow unfinished tasks even if their due date is earlier. */
  test('list puts unfinished first then earliest due date', function completionOrder() {
    const list = [sample({ id: 'done', completed: true, dueDate: new Date('2026-01-01') }), sample({ id: 'later', dueDate: new Date('2026-03-01') }), sample({ id: 'early', dueDate: new Date('2026-02-01') })].sort(compareTasksForList);
    // Stable document IDs identify the expected task order.
    expect(list.map(function idOf(task) { return task.id; })).toEqual(['early', 'later', 'done']);
  });
});
/** Verify exactly which task fields participate in equality. */
describe('areTasksEqual', function equalitySuite() {
  /** Ignore fields outside the lab's equality definition. */
  test('ignores completion state, ID and dateAdded', function ignoredFields() { expect(areTasksEqual(sample({ id: 'a' }), sample({ id: 'b', completed: true, dateAdded: new Date('2020-01-01') }))).toBe(true); });
  /** Different names must not compare equal. */
  test('differs when name differs', function namesDiffer() { expect(areTasksEqual(sample({ name: 'A' }), sample({ name: 'B' }))).toBe(false); });
  /** Different assignees must not compare equal. */
  test('differs when assignee differs', function assigneesDiffer() { expect(areTasksEqual(sample({ assignedTo: 'Dion' }), sample({ assignedTo: 'Prof H' }))).toBe(false); });
  /** Different due dates must not compare equal. */
  test('differs when due date differs', function datesDiffer() { expect(areTasksEqual(sample({ dueDate: new Date('2026-01-01') }), sample({ dueDate: new Date('2026-02-01') }))).toBe(false); });
  /** Date object identity is irrelevant when timestamps are equal. */
  test('compares Date values rather than object identity', function equalTimestamps() { expect(areTasksEqual(sample(), sample({ dueDate: new Date(fixedDate.getTime()) }))).toBe(true); });
});
