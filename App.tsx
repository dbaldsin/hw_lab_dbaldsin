import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './types';
import CardView from './views/CardView';
import DefinitionView from './views/DefinitionView';

const Stack = createNativeStackNavigator<RootStackParamList>();

type DefinitionProps = NativeStackScreenProps<RootStackParamList, 'Definition'>;

function DefinitionViewScreen({ route }: DefinitionProps) {
  return <DefinitionView definition={route.params.definition} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="Home" component={CardView} options={{ title: 'RailsCards' }} />
        <Stack.Screen name="Definition" component={DefinitionViewScreen} options={{ title: 'Definition' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
