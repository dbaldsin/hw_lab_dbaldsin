import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person, createBlankPerson } from '../models/Person';

const STORAGE_KEY = '@SimpleContacts:people';
export type SortOrder = 'asc' | 'desc';

// Filters contacts by a case-insensitive name fragment, then returns a separately sorted copy.
export function filterAndSort(people: Person[], searchText: string, sortOrder: SortOrder): Person[] {
  const needle = searchText.trim().toLowerCase();
  const filtered = needle === '' ? people : people.filter((person) => person.name.toLowerCase().includes(needle));
  return [...filtered].sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
}

type PeopleContextValue = {
  people: Person[];
  loading: boolean;
  addPerson: () => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
};

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

// Loads contacts once, persists subsequent changes, and exposes contact mutations to child screens.
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieves the previously saved array before allowing it to be overwritten.
    const loadPeople = async () => {
      try {
        const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedPeople) setPeople(JSON.parse(savedPeople));
      } catch (error) {
        console.error('Error loading people:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPeople();
  }, []);

  useEffect(() => {
    // Saves every state change after initial storage hydration has completed.
    if (!loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people)).catch((error) => console.error('Error saving people:', error));
  }, [people, loading]);

  // Appends a fresh empty contact and returns it so the list can navigate directly to editing it.
  const addPerson = (): Person => {
    const person = createBlankPerson();
    setPeople((current) => [...current, person]);
    return person;
  };

  // Merges only the changed fields into the matching contact.
  const updatePerson = (id: string, updates: Partial<Person>) => setPeople((current) => current.map((person) => person.id === id ? { ...person, ...updates } : person));
  // Removes one contact by identity without changing the remaining records.
  const deletePerson = (id: string) => setPeople((current) => current.filter((person) => person.id !== id));
  // Finds the current version of a contact for the details screen.
  const getPerson = (id: string) => people.find((person) => person.id === id);

  return <PeopleContext.Provider value={{ people, loading, addPerson, updatePerson, deletePerson, getPerson }}>{children}</PeopleContext.Provider>;
}

// Enforces that consumer screens are rendered inside the shared people provider.
export function usePeople(): PeopleContextValue {
  const context = useContext(PeopleContext);
  if (!context) throw new Error('usePeople must be used inside a PeopleProvider');
  return context;
}
