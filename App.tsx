import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import GeneralStack from './src/routes/generalStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { PlanetProvider } from './src/providers/PlanetProvider';

const App = () => {
  return (
    <SafeAreaProvider>
      <PlanetProvider>
      <NavigationContainer>
        <GeneralStack />
      </NavigationContainer>
      </PlanetProvider>
    </SafeAreaProvider>
  );
};

export default App;
