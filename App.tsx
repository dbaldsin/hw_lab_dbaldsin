import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PeopleProvider } from './viewModels/PeopleContext';
import PeopleView from './views/PeopleView';
import EditPersonView from './views/EditPersonView';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Builds the app's navigation tree and makes the shared contact store available to every screen.
export default function App() {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="People" component={PeopleView} options={{ title: 'My Contacts' }} />
          <Stack.Screen name="EditPerson" component={EditPersonView} options={{ title: 'Edit Person', headerBackTitle: 'My Contacts' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PeopleProvider>
  );
}
