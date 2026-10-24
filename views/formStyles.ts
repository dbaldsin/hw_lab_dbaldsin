import { StyleSheet } from 'react-native';
export const formStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }, section: { backgroundColor: 'white', marginTop: 20, paddingHorizontal: 16, paddingVertical: 12 },
  label: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginBottom: 8 },
  input: { fontSize: 17, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc', color: '#202124' },
  date: { fontSize: 17, color: '#007AFF', paddingVertical: 12 },
  button: { margin: 16, padding: 16, borderRadius: 8, backgroundColor: '#007AFF', alignItems: 'center', minHeight: 52 },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  status: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10 },
  muted: { color: '#777', padding: 16 }, disabled: { opacity: 0.5 },
});
