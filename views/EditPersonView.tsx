import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import { usePeople } from '../viewModels/PeopleContext';

type RouteProps = RouteProp<RootStackParamList, 'EditPerson'>;

// Lets the user edit the live contact record and choose an optional photo from the device library.
export default function EditPersonView() {
  const route = useRoute<RouteProps>();
  const { getPerson, updatePerson } = usePeople();
  const person = getPerson(route.params.personId);

  // Requests library access, opens the native picker, and stores the selected file URI on the contact.
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo access in Settings to add a contact photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets.length > 0 && person) updatePerson(person.id, { photoUri: result.assets[0].uri });
  };

  if (!person) return <View style={styles.centered}><Text>Contact not found.</Text></View>;

  return <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Photo</Text>
      {person.photoUri ? <Image source={{ uri: person.photoUri }} style={styles.photo} resizeMode="cover" /> : <View style={styles.photoPlaceholder}><Ionicons name="person" size={64} color="#b0b4bb" /></View>}
      <Pressable style={styles.photoButton} onPress={pickImage}><Ionicons name="images-outline" size={20} color="#007AFF" /><Text style={styles.photoButtonText}>Select a photo</Text></Pressable>
    </View>
    <View style={styles.section}><Text style={styles.sectionHeader}>Information</Text>
      <TextInput style={styles.input} placeholder="Name" value={person.name} onChangeText={(text) => updatePerson(person.id, { name: text })} textContentType="name" />
      <TextInput style={styles.input} placeholder="Email" value={person.email} onChangeText={(text) => updatePerson(person.id, { email: text })} textContentType="emailAddress" autoCapitalize="none" keyboardType="email-address" />
    </View>
    <View style={styles.section}><Text style={styles.sectionHeader}>Details</Text>
      <TextInput style={[styles.input, styles.detailsInput]} placeholder="Details on this person" value={person.details} onChangeText={(text) => updatePerson(person.id, { details: text })} multiline />
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' }, centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { backgroundColor: '#fff', padding: 14, marginTop: 20 }, sectionHeader: { fontSize: 13, fontWeight: '600', color: '#6c6c70', textTransform: 'uppercase', marginBottom: 9 },
  input: { fontSize: 16, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#c7c7cc' }, detailsInput: { minHeight: 100, textAlignVertical: 'top', borderBottomWidth: 0 },
  photo: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12 }, photoPlaceholder: { height: 130, borderRadius: 12, backgroundColor: '#f2f2f7', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  photoButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 }, photoButtonText: { fontSize: 16, color: '#007AFF' },
});
