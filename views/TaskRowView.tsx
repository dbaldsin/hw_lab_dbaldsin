import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TaskItem } from '../models/TaskItem';
import { formatDate } from '../viewModels/taskFormHelpers';
type Props = { task: TaskItem; onPress: () => void; onToggleCompleted: () => void; busy: boolean };
/** Show task identity, due date, and a separate accessible completion control. */
export default function TaskRowView({ task, onPress, onToggleCompleted, busy }: Props) {
  return <View style={styles.row}>
    <Pressable accessibilityRole="checkbox" accessibilityLabel={`Complete ${task.name}`} accessibilityState={{ checked: task.completed, disabled: busy }} disabled={busy} onPress={onToggleCompleted} style={styles.checkbox}>
      <Ionicons name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={task.completed ? '#34a853' : '#007AFF'} />
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${task.name}`} onPress={onPress} style={styles.content}>
      <View style={styles.text}><Text style={[styles.name, task.completed && styles.done]}>{task.name}</Text><Text style={styles.assignee}>Assigned to: {task.assignedTo}</Text><Text style={[styles.date, task.completed && styles.done]}>Due {formatDate(task.dueDate)}</Text></View>
      <Ionicons name="chevron-forward" size={18} color="#8c8c91" />
    </Pressable>
  </View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd' },
  checkbox: { width: 56, justifyContent: 'center', alignItems: 'center', minHeight: 90 },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingRight: 16 },
  text: { flex: 1 }, name: { fontSize: 17, fontWeight: '600', color: '#202124' },
  assignee: { fontSize: 14, color: '#666', marginTop: 4 }, date: { fontSize: 14, color: '#007AFF', marginTop: 5 },
  done: { textDecorationLine: 'line-through', color: '#777' },
});
