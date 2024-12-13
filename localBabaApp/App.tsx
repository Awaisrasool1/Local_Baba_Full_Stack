import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GlobalProvider} from './src/contexts/GlobalContext';
import AppNavigator from './src/navigation/AppNavigator';
import {ToastProvider} from 'react-native-toasty-toast';
import {
  NotificationListener,
  requestUserPermission,
} from './src/hooks/NotificationHook';
import NavigationService from './src/navigation/NavigationService';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaProvider>
          <GlobalProvider>
            <ToastProvider>
              <NavigationContainer
                ref={(ref: any) => NavigationService.setTopLevelNavigator(ref)}>
                <AppNavigator />
              </NavigationContainer>
            </ToastProvider>
          </GlobalProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default App;
