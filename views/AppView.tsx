import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LibraryStackParamList } from '../types';
import { LibraryProvider } from '../viewModels/LibraryContext';
import BookDetailsView from './BookDetailsView';
import ChartsView from './ChartsView';
import LibraryView from './LibraryView';
import NewBookView from './NewBookView';

const Tab = createBottomTabNavigator();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

function LibraryStackScreen() {
  return <LibraryStack.Navigator><LibraryStack.Screen name="LibraryList" component={LibraryView} options={{ headerShown: false }} /><LibraryStack.Screen name="BookDetails" component={BookDetailsView} options={{ title: 'Book Details' }} /></LibraryStack.Navigator>;
}
export default function AppView() {
  return <LibraryProvider><NavigationContainer><Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: '#2563eb', tabBarInactiveTintColor: '#64748b', tabBarIcon: ({ color, size }) => { const icons: Record<string, keyof typeof Ionicons.glyphMap> = { Library: 'library-sharp', 'New Book': 'book-outline', Charts: 'bar-chart' }; return <Ionicons name={icons[route.name]} size={size} color={color} />; } })}><Tab.Screen name="Library" component={LibraryStackScreen} /><Tab.Screen name="New Book" component={NewBookView} /><Tab.Screen name="Charts" component={ChartsView} /></Tab.Navigator></NavigationContainer></LibraryProvider>;
}
