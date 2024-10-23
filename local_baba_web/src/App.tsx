import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
