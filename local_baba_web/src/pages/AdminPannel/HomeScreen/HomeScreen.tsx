import React from 'react';
import { useAuth } from '../../../context/AuthProvider';

const HomeScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      {isAuthenticated ? (
        <p>You are logged in!</p>
      ) : (
        <p>Please log in to access more features.</p>
      )}
    </div>
  );
};

export default HomeScreen;
