import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  DashBoard,
  OrderList,
  OrderHistory,
  Restaurants,
  Riders,
} from "../pages";
import Sidebar from "../components/SideBar.tsx/SideBar";

const AppNavigation = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/riders" element={<Riders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppNavigation;
