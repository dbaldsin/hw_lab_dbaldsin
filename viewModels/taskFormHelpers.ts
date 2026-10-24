import { Alert, Platform } from 'react-native';
import { isValidTask } from '../models/TaskItem';

/** Render a consistent human-readable due date on every screen. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
/** Use native alerts on mobile and browser dialogs for the web preview. */
export function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}
/** Adapt platform picker dismissal while ignoring cancelled selections. */
export function makeDateChangeHandler(setShowPicker: (show: boolean) => void, onPick: (date: Date) => void) {
  // Android closes after selection; iOS keeps its inline spinner visible.
  return function handleDateChange(_event: unknown, selected?: Date) {
    setShowPicker(Platform.OS === 'ios');
    if (selected) onPick(selected);
  };
}
/** Validate both fields, await persistence, and navigate only after a successful write. */
export async function saveWithValidation(name: string, assignedTo: string, save: () => Promise<void>, onDone: () => void, onError?: (message: string) => void) {
  /** Display recoverable feedback without blocking the web interface. */
  function fail(title: string, message: string) {
    onError?.(message);
    if (Platform.OS !== 'web' || !onError) showMessage(title, message);
  }
  if (!isValidTask(name, assignedTo)) {
    fail('Validation Error', 'Please fill in both name and assignee.');
    return;
  }
  try { await save(); onDone(); }
  catch { fail('Error', 'Failed to save task. Check your connection and Firestore rules.'); }
}
/** Ask before deletion and leave the screen open if persistence fails. */
export function confirmDelete(performDelete: () => Promise<void>, onDone: () => void) {
  // This handler runs only after the user confirms the destructive action.
  async function remove() {
    try { await performDelete(); onDone(); }
    catch { showMessage('Error', 'Failed to delete task.'); }
  }
  if (Platform.OS === 'web') {
    if (window.confirm('Delete Task: Are you sure you want to delete this task?')) void remove();
  } else {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: remove },
    ]);
  }
}
