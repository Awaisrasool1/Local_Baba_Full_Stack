import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from "../pages";
import AppNavigation from "./AppNavigator";

function AuthNavigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="AppNavigation" element={<AppNavigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AuthNavigation;
