import React from 'react';
import { AuthProvider } from './context';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AuthNavigation from './navigation/AuthNavigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthNavigation />
    </AuthProvider>
  );
};

export default App;
