import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTasks } from '../viewModels/TasksContext';
import { TaskItem } from '../models/TaskItem';
import { showMessage } from '../viewModels/taskFormHelpers';
import { usingEmulator } from '../config/firebase';
import TaskRowView from './TaskRowView';
import type { TasksStackParamList } from '../types';
/** Render loading, errors, an empty state, or the shared real-time task list. */
export default function TasksView() {
  const { tasks, loading, error, toggleCompleted } = useTasks();
  const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TasksList'>>();
  const [pending, setPending] = useState<string[]>([]);
  /** Persist a completion change and report failures without an unhandled rejection. */
  async function toggle(task: TaskItem) {
    // Append through a state updater so simultaneous row actions keep both IDs.
    setPending(function addPending(ids) { return [...ids, task.id!]; });
    try { await toggleCompleted(task); }
    catch { showMessage('Error', 'Failed to update completion.'); }
    finally { setPending(function removePending(ids) { return ids.filter(function keepOther(id) { return id !== task.id; }); }); }
  }
  /** Bind each row to the current task ID and completion action. */
  function renderTask({ item }: ListRenderItemInfo<TaskItem>) {
    /** Open details using only a serializable document ID. */
    function openDetails() { navigation.navigate('TaskDetails', { taskId: item.id! }); }
    /** Start the checked row's asynchronous completion update. */
    function complete() { void toggle(item); }
    return <TaskRowView task={item} onPress={openDetails} onToggleCompleted={complete} busy={pending.includes(item.id!)} />;
  }
  /** Use Firestore IDs so reordering does not recreate task rows. */
  function taskKey(task: TaskItem) { return task.id!; }
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading tasks…</Text></View>;
  if (error) return <View style={styles.center}><Text style={styles.title}>Unable to load tasks</Text><Text style={styles.message}>{error}</Text></View>;
  return <View style={styles.container}>
    {usingEmulator && <Text style={styles.notice}>Local Firestore emulator • verification mode</Text>}
    <FlatList data={tasks} keyExtractor={taskKey} renderItem={renderTask}
      ListHeaderComponent={<Text style={styles.summary}>YOUR TASKS · {tasks.length}</Text>}
      ListEmptyComponent={<View style={styles.center}><Text style={styles.title}>No tasks yet</Text><Text style={styles.message}>Head to the New Task tab to create one.</Text></View>} />
  </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f5f5f5' }, center: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center', gap: 12 }, title: { fontSize: 21, fontWeight: '600' }, message: { fontSize: 16, color: '#666', textAlign: 'center' }, summary: { padding: 16, color: '#666', fontSize: 13, letterSpacing: 1 }, notice: { padding: 10, color: '#775400', backgroundColor: '#fff3cd', textAlign: 'center' } });
