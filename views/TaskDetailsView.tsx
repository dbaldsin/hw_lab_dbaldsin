import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTasks } from '../viewModels/TasksContext';
import { TasksStackParamList } from '../types';
import { confirmDelete, formatDate, saveWithValidation, showMessage } from '../viewModels/taskFormHelpers';
import TaskDateField from './TaskDateField';
import { formStyles as styles } from './formStyles';
/** Look up the latest shared task by ID and edit a local draft until Save. */
export default function TaskDetailsView() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<TasksStackParamList, 'TaskDetails'>>();
  // Matching by ID avoids stale whole-object navigation parameters.
  const task = tasks.find(function matchesId(item) { return item.id === route.params.taskId; });
  const [name, setName] = useState(task?.name ?? '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? new Date());
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  /** Dismiss details only once persistence has finished. */
  function finish() { navigation.goBack(); }
  /** Toggle the local draft; the shared document changes only after Save. */
  function toggleStatus() { setCompleted(!completed); }
  /** Validate and update the latest task while keeping its original dateAdded. */
  async function onSave() {
    if (!task || saving.current) return;
    saving.current = true; setBusy(true); setFeedback(null);
    /** Commit just this form's editable values through the shared provider. */
    async function persist() { await updateTask({ ...task!, name, assignedTo, dueDate, completed }); }
    try { await saveWithValidation(name, assignedTo, persist, finish, setFeedback); }
    finally { saving.current = false; setBusy(false); }
  }
  /** Delete only after an explicit confirmation and restore controls on failure. */
  async function removeConfirmed() {
    if (!task || saving.current) return;
    saving.current = true; setBusy(true); setShowDelete(false);
    try { await deleteTask(task.id!); finish(); }
    catch { showMessage('Error', 'Failed to delete task.'); }
    finally { saving.current = false; setBusy(false); }
  }
  /** Cancel the web confirmation without changing the Firestore document. */
  function cancelDelete() { setShowDelete(false); }
  /** Use an in-app web dialog so browser popups cannot block the interface. */
  function onDelete() {
    if (!task || busy) return;
    if (Platform.OS === 'web') setShowDelete(true);
    else confirmDelete(removeConfirmed, function deletionFinished() { /* removeConfirmed already navigates after persistence. */ });
  }
  if (!task) return <View style={styles.section}><Text>Task not found.</Text><Text style={styles.muted}>This task may have been deleted on another device.</Text></View>;
  return <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
    <View style={styles.section}><Text style={styles.label}>Task Name</Text><TextInput accessibilityLabel="Task name" value={name} onChangeText={setName} editable={!busy} style={styles.input} /></View>
    <View style={styles.section}><Text style={styles.label}>Assigned To</Text><TextInput accessibilityLabel="Assigned to" value={assignedTo} onChangeText={setAssignedTo} editable={!busy} style={styles.input} /></View>
    <TaskDateField value={dueDate} onChange={setDueDate} />
    <View style={styles.section}><Text style={styles.label}>Status</Text><Pressable accessibilityRole="checkbox" accessibilityLabel="Task completed" accessibilityState={{ checked: completed }} disabled={busy} onPress={toggleStatus} style={styles.status}><Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={completed ? '#34a853' : '#007AFF'} /><Text>{completed ? 'Completed' : 'Not Completed'}</Text></Pressable></View>
    <Text style={styles.muted}>Added {formatDate(task.dateAdded)}</Text>
    {feedback && <Text accessibilityRole="alert" style={{ color: '#b42318', padding: 16 }}>Validation Error: {feedback}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} style={[styles.button, busy && styles.disabled]} onPress={onSave}><Text style={styles.buttonText}>{busy ? 'Saving…' : 'Save Changes'}</Text></Pressable>
    <Modal transparent visible={showDelete} animationType="none" onRequestClose={cancelDelete}>
      <View style={{ flex: 1, backgroundColor: '#0006', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View accessibilityRole="alert" style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, width: '100%', maxWidth: 360 }}>
          <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 12 }}>Delete Task</Text>
          <Text style={{ fontSize: 16 }}>Are you sure you want to delete this task?</Text>
          <Pressable accessibilityRole="button" onPress={cancelDelete} style={[styles.button, { backgroundColor: '#666', marginHorizontal: 0 }]}><Text style={styles.buttonText}>Cancel</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={removeConfirmed} style={[styles.button, { backgroundColor: '#d92d20', margin: 0 }]}><Text style={styles.buttonText}>Confirm Delete</Text></Pressable>
        </View>
      </View>
    </Modal>
    <Pressable accessibilityRole="button" disabled={busy} style={[styles.button, { backgroundColor: '#d92d20' }, busy && styles.disabled]} onPress={onDelete}><Text style={styles.buttonText}>Delete Task</Text></Pressable>
  </ScrollView>;
}
