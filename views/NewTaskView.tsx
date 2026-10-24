import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTasks } from '../viewModels/TasksContext';
import { saveWithValidation } from '../viewModels/taskFormHelpers';
import { RootTabParamList } from '../types';
import TaskDateField from './TaskDateField';
import { formStyles as styles } from './formStyles';
/** Keep a new task draft local until validation and Firestore insertion succeed. */
export default function NewTaskView() {
  const { addTask } = useTasks();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList, 'NewTask'>>();
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  /** Insert once, clear the draft on success, and return to the Tasks tab. */
  async function onSave() {
    if (saving.current) return;
    saving.current = true; setBusy(true); setFeedback(null);
    /** Store timestamps through the provider rather than inside the view. */
    async function persist() { await addTask({ name, assignedTo, dueDate, dateAdded: new Date(), completed: false }); }
    /** Reset every draft field after a successful write. */
    function finish() { setName(''); setAssignedTo(''); setDueDate(new Date()); setFormVersion(formVersion + 1); navigation.navigate('Tasks'); }
    try { await saveWithValidation(name, assignedTo, persist, finish, setFeedback); }
    finally { saving.current = false; setBusy(false); }
  }
  return <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
    <View style={styles.section}><Text style={styles.label}>Task Name</Text><TextInput accessibilityLabel="Task name" placeholder="Enter task name" value={name} onChangeText={setName} editable={!busy} style={styles.input} /></View>
    <View style={styles.section}><Text style={styles.label}>Assigned To</Text><TextInput accessibilityLabel="Assigned to" placeholder="Enter assignee name" value={assignedTo} onChangeText={setAssignedTo} editable={!busy} style={styles.input} /></View>
    <TaskDateField key={formVersion} value={dueDate} onChange={setDueDate} />
    {feedback && <Text accessibilityRole="alert" style={{ color: '#b42318', padding: 16 }}>Validation Error: {feedback}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} style={[styles.button, busy && styles.disabled]} onPress={onSave}><Text style={styles.buttonText}>{busy ? 'Saving…' : 'Save Task'}</Text></Pressable>
  </ScrollView>;
}
