import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { GlobalProvider } from './src/contexts/GlobalContext';
import AuthStackNavigation from './src/navigation/AuthStackNavigation';

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <GlobalProvider>
          <NavigationContainer>
            <AuthStackNavigation />
          </NavigationContainer>
        </GlobalProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
