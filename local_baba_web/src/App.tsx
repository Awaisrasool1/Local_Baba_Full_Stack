import React from 'react';
import { AuthProvider } from './context';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppNavigation from './navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigation/>
    </AuthProvider>
  );
};

export default App;
