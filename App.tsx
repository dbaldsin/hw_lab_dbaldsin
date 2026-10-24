import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { TasksProvider } from './viewModels/TasksContext';
import TasksView from './views/TasksView';
import NewTaskView from './views/NewTaskView';
import TaskDetailsView from './views/TaskDetailsView';
import { TasksStackParamList, RootTabParamList } from './types';
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<TasksStackParamList>();
/** Nest details inside Tasks while retaining the app's two bottom tabs. */
function TasksStackScreen() {
  return <Stack.Navigator><Stack.Screen name="TasksList" component={TasksView} options={{ title: 'Arbeit' }} /><Stack.Screen name="TaskDetails" component={TaskDetailsView} options={{ title: 'Task Details' }} /></Stack.Navigator>;
}
/** Render the icon for the Tasks tab. */
function tasksIcon({ color, size }: { color: string; size: number }) { return <Ionicons name="checkmark-done-circle" size={size} color={color} />; }
/** Render the icon for creating a new task. */
function newIcon({ color, size }: { color: string; size: number }) { return <Ionicons name="add-circle" size={size} color={color} />; }
const tasksOptions: BottomTabNavigationOptions = { title: 'Tasks', tabBarIcon: tasksIcon };
const newOptions: BottomTabNavigationOptions = { title: 'New Task', headerShown: true, tabBarIcon: newIcon };
/** Place one shared provider above all navigation so every screen sees live updates. */
export default function App() {
  return <TasksProvider><StatusBar style="dark" /><NavigationContainer><Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007AFF', tabBarLabelStyle: { fontSize: 12 } }}><Tab.Screen name="Tasks" component={TasksStackScreen} options={tasksOptions} /><Tab.Screen name="NewTask" component={NewTaskView} options={newOptions} /></Tab.Navigator></NavigationContainer></TasksProvider>;
}
