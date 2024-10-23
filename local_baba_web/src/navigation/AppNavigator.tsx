import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomeScreen, LoginScreen } from "../pages";

const AppNavigator: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
};

export default AppNavigator;
