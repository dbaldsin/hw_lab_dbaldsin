import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LibraryStackParamList } from '../types';
type Props = NativeStackScreenProps<LibraryStackParamList, 'BookDetails'>;
export default function BookDetailsView({ route }: Props) { const { book } = route.params; return <View style={styles.container}><Text style={styles.eyebrow}>BOOK DETAILS</Text><Text style={styles.title}>{book.title}</Text><View style={styles.divider} /><Text style={styles.label}>Author</Text><Text style={styles.value}>{book.author}</Text><Text style={styles.label}>Author gender</Text><Text style={styles.value}>{book.gender}</Text><Text style={styles.label}>Display in library</Text><Text style={styles.value}>{book.displayed ? 'Yes' : 'No'}</Text></View>; }
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, backgroundColor: '#fff' }, eyebrow: { fontSize: 12, fontWeight: '700', color: '#2563eb', letterSpacing: 1 }, title: { fontSize: 30, fontWeight: '700', color: '#0f172a', marginTop: 8 }, divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 24 }, label: { fontSize: 13, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginTop: 16 }, value: { fontSize: 18, color: '#1e293b', marginTop: 4 } });
