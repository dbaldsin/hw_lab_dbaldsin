import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Book } from '../models/Book';
import type { LibraryStackParamList } from '../types';
import { useLibrary } from '../viewModels/LibraryContext';

type NavProp = NativeStackNavigationProp<LibraryStackParamList, 'LibraryList'>;
function BookRowView({ book }: { book: Book }) {
  const navigation = useNavigation<NavProp>(); const { removeBook } = useLibrary();
  return <Swipeable renderRightActions={() => <Pressable accessibilityLabel={`Delete ${book.title}`} style={styles.deleteAction} onPress={() => removeBook(book.id)}><Text style={styles.deleteText}>Delete</Text></Pressable>}><Pressable accessibilityRole="button" style={styles.row} onPress={() => navigation.navigate('BookDetails', { book })}><Text style={styles.rowTitle}>{book.title}</Text><Text style={styles.rowAuthor}>{book.author}</Text></Pressable></Swipeable>;
}
export default function LibraryView() {
  const { books } = useLibrary();
  return <View style={styles.container}><View style={styles.header}><Text style={styles.heading}>Library</Text><Text style={styles.count}>{books.length} books</Text></View><FlatList data={books} keyExtractor={(item) => item.id} renderItem={({ item }) => <BookRowView book={item} />} ItemSeparatorComponent={() => <View style={styles.separator} />} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff', paddingTop: 64 }, header: { paddingHorizontal: 20, paddingBottom: 14 }, heading: { fontSize: 30, fontWeight: '700', color: '#0f172a' }, count: { fontSize: 15, color: '#64748b', marginTop: 3 }, row: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#fff' }, rowTitle: { fontSize: 17, fontWeight: '600', color: '#1e293b' }, rowAuthor: { fontSize: 14, color: '#64748b', marginTop: 3 }, separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#e2e8f0', marginLeft: 20 }, deleteAction: { backgroundColor: '#dc2626', justifyContent: 'center', paddingHorizontal: 22 }, deleteText: { color: '#fff', fontWeight: '700' } });
