import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlanetDetailsScreen from '../screens/PlanetsScreen/PlanetDetailsScreen';
import TabStack from './tabStack';
import { colors } from '../constants/colors';

export type StackParamList = {
  PlanetDetails: { planetId: string; }
};

const GeneralStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: { backgroundColor: colors.backgroundColor},
        headerTintColor: '#FFFFFF',
      }}>
      <Stack.Screen name="Tabs" component={TabStack} />
      <Stack.Screen name="PlanetDetails" component={PlanetDetailsScreen} initialParams={{ planetId: ''}} />
    </Stack.Navigator>
  );
};

export default GeneralStack;
