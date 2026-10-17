import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { filterAndSort, type SortOrder, usePeople } from '../viewModels/PeopleContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'People'>;

// Displays the persistent contact collection with native search, sort, add, and swipe-delete controls.
export default function PeopleView() {
  const navigation = useNavigation<NavProp>();
  const { people, loading, addPerson, deletePerson } = usePeople();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Creates a blank contact and immediately opens its edit form.
  const handleAdd = () => {
    const person = addPerson();
    navigation.navigate('EditPerson', { personId: person.id });
  };

  // Presents the two supported alphabetical sort directions.
  const handleSort = () => Alert.alert('Sort contacts', 'Choose a name order.', [
    { text: 'Name (A-Z)', onPress: () => setSortOrder('asc') },
    { text: 'Name (Z-A)', onPress: () => setSortOrder('desc') },
    { text: 'Cancel', style: 'cancel' },
  ]);

  useLayoutEffect(() => {
    // Configures the native navigation header after the screen receives its navigation object.
    navigation.setOptions({
      headerSearchBarOptions: { placeholder: 'Search', onChangeText: (event: any) => setSearchText(event.nativeEvent.text) },
      headerRight: () => <View style={styles.headerButtons}>
        <Pressable accessibilityLabel="Sort contacts" hitSlop={10} onPress={handleSort}><Ionicons name="swap-vertical" size={22} color="#007AFF" /></Pressable>
        <Pressable accessibilityLabel="Add contact" hitSlop={10} onPress={handleAdd}><Ionicons name="add" size={27} color="#007AFF" /></Pressable>
      </View>,
    });
  }, [navigation, searchText, sortOrder]);

  const displayedPeople = useMemo(() => filterAndSort(people, searchText, sortOrder), [people, searchText, sortOrder]);

  if (loading) return <View style={styles.centered}><Text style={styles.muted}>Loading contacts...</Text></View>;

  if (displayedPeople.length === 0) return <View style={styles.centered}><Ionicons name="people-outline" size={46} color="#9aa0a6" /><Text style={styles.emptyTitle}>No Contacts Yet</Text><Text style={styles.muted}>Tap + to add your first contact.</Text></View>;

  return <View style={styles.list}>
    {displayedPeople.map((item) => <View key={item.id} style={styles.rowWrap}>
      <Pressable style={styles.row} onPress={() => navigation.navigate('EditPerson', { personId: item.id })}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(item.name || 'N').trim().charAt(0).toUpperCase()}</Text></View>
        <View style={styles.rowText}><Text style={styles.name}>{item.name || 'New Contact'}</Text>{item.email ? <Text style={styles.email}>{item.email}</Text> : null}</View>
        <Ionicons name="chevron-forward" size={18} color="#9aa0a6" />
      </Pressable>
      <Pressable accessibilityLabel={`Delete ${item.name || 'contact'}`} style={styles.deleteButton} onPress={() => deletePerson(item.id)}><Ionicons name="trash-outline" size={20} color="#ff3b30" /></Pressable>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  headerButtons: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  list: { flex: 1, backgroundColor: '#fff' },
  rowWrap: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#d1d1d6', backgroundColor: '#fff' }, row: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#fff' },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f1ff', marginRight: 12 }, avatarText: { color: '#007AFF', fontWeight: '700', fontSize: 18 },
  rowText: { flex: 1 }, name: { fontSize: 17, color: '#111' }, email: { color: '#6c6c70', fontSize: 13, marginTop: 2 },
  deleteButton: { padding: 16 },
  centered: { flex: 1, minHeight: 340, alignItems: 'center', justifyContent: 'center', padding: 24 }, emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 4 }, muted: { color: '#6c6c70', textAlign: 'center' },
});
