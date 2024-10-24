import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Users,
  Store,
  Bike,
} from "lucide-react";
import logo from "../../assets/img/logo.png";
import "./Sidebar.css"; 

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <ClipboardList size={20} />, label: "Order List", path: "/orders" },
    { icon: <History size={20} />, label: "Order History", path: "/history" },
    { icon: <Users size={20} />, label: "Customers", path: "/customers" },
    { icon: <Store size={20} />, label: "Restaurants", path: "/restaurants" },
    { icon: <Bike size={20} />, label: "Riders", path: "/riders" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className="sidebar-container d-flex flex-column flex-shrink-0 p-3 bg-white border-end"
      style={{ width: "280px", height: "100vh" }}
    >
      {/* Logo */}
      <div
        className="logo-container mb-4 px-2 d-flex justify-content-center"
        onClick={() => handleNavigation("/")}
        style={{ cursor: "pointer" }}
      >
        <img
          src={logo}
          alt="Logo"
          className="img-fluid"
          style={{ width: "100px", height: "auto" }}
        />
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto mt-5 ms-3">
        {navItems.map((item, index) => (
          <li key={index} className="sidebar-nav-item">
            <button
              onClick={() => handleNavigation(item.path)}
              className={`nav-link text-dark d-flex align-items-center border-0 ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="me-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Add Restaurant Card */}
      <div className="add-restaurant-card mt-3 p-3 bg-light rounded">
        <div className="text-center">
          <div className="d-flex justify-content-center mb-2">
            <div
              className="chef-icon rounded-circle bg-white d-flex align-items-center justify-content-center"
              style={{ width: "48px", height: "48px" }}
            >
              👨‍🍳
            </div>
          </div>
          <p className="text-muted small mb-3">
            Please organize your menus through button bellow!
          </p>
          <button
            className="add-restaurant-button btn btn-success w-100"
            onClick={() => handleNavigation("/add-restaurant")}
          >
            + Add Restaurant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;