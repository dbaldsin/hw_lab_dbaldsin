import React, { useState } from 'react';
import { Platform, View, Text, Pressable, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate, makeDateChangeHandler } from '../viewModels/taskFormHelpers';
import { formStyles as styles } from './formStyles';
/** Share native date picking; web preview accepts an ISO calendar date. */
export default function TaskDateField({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const [show, setShow] = useState(false);
  const [webDate, setWebDate] = useState(toCalendarDate(value));
  /** Toggle the iOS inline picker or open Android's native date dialog. */
  function togglePicker() { setShow(!show); }
  /** Parse a full calendar date without UTC shifting the user's local date. */
  function changeWebDate(text: string) {
    setWebDate(text);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return;
    const [year, month, day] = text.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) onChange(date);
  }
  return <View style={styles.section}><Text style={styles.label}>Due Date</Text>
    {Platform.OS === 'web' ? <><Text style={styles.date}>{formatDate(value)}</Text><TextInput accessibilityLabel="Due date YYYY-MM-DD" placeholder="YYYY-MM-DD" value={webDate} onChangeText={changeWebDate} style={styles.input} /></> : <>
      <Pressable accessibilityRole="button" accessibilityLabel="Choose due date" onPress={togglePicker}><Text style={styles.date}>{formatDate(value)}</Text></Pressable>
      {show && <DateTimePicker value={value} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={makeDateChangeHandler(setShow, onChange)} />}
      {show && Platform.OS === 'ios' && <Pressable accessibilityRole="button" onPress={togglePicker}><Text style={styles.date}>Done</Text></Pressable>}
    </>}
  </View>;
}
/** Format a local Date as the editable web calendar value. */
function toCalendarDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
