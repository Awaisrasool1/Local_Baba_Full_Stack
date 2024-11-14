import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  DashBoard,
  OrderList,
  OrderHistory,
  Restaurants,
  Riders,
  LoginScreen,
  Customers,
  RestaurantDashBoard,
  RestaurantOrder,
  RestaurantOrderHistory,
  RestaurantReview,
  RestaurantMenu,
  AddMenu,
} from "../pages";
import Sidebar from "../components/SideBar.tsx/SideBar";
import {
  ClipboardList,
  LayoutDashboard,
  History,
  Users,
  Store,
  Bike,
  Star,
  Menu,
} from "lucide-react";

const AppNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [role, setRole] = useState<number>();

  const handleLogin = (role:any) => {
    setIsLoggedIn(true);
    setRole(role)
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const roleStatus: any = localStorage.getItem("role");
    setRole(Number(roleStatus));
    setIsLoggedIn(loggedInStatus);
  }, [isLoggedIn]);

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/admin-DashBoard",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Order List",
      path: "/admin-Orders",
    },
    {
      icon: <History size={20} />,
      label: "Order History",
      path: "/admin-Order-History",
    },
    { icon: <Users size={20} />, label: "Customers", path: "/admin-Customers" },
    {
      icon: <Store size={20} />,
      label: "Restaurants",
      path: "/admin-Restaurants",
    },
    { icon: <Bike size={20} />, label: "Riders", path: "/admin-Riders" },
  ];
  const navItems2 = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/restaurant-DashBoard",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Order List",
      path: "/resturant-Orders",
    },
    {
      icon: <History size={20} />,
      label: "Order History",
      path: "/resturant-Order-History",
    },
    { icon: <Star size={20} />, label: "Review", path: "/resturant-Review" },
    { icon: <Menu size={20} />, label: "Menu", path: "/restaurant-Menu" },
  ];
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && (
          <Sidebar
            onLogOut={handleLogout}
            isAddRestaurant={role == 1 ? true : false}
            sideBarItem={role == 1 ? navItems : navItems2}
          />
        )}

        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  role === 1 ? (
                    <Navigate to="/admin-DashBoard" />
                  ) : (
                    <Navigate to="/restaurant-DashBoard" />
                  )
                ) : (
                  <LoginScreen onLogin={handleLogin} />
                )
              }
            />
            {isLoggedIn ? (
              <>
              {/* Admin routes */}
              {role === 1 && (
                <>
                  <Route path="/admin-DashBoard" element={<DashBoard />} />
                  <Route path="/admin-Orders" element={<OrderList />} />
                  <Route path="/admin-Order-History" element={<OrderHistory />} />
                  <Route path="/admin-Restaurants" element={<Restaurants />} />
                  <Route path="/admin-Customers" element={<Customers />} />
                  <Route path="/admin-Riders" element={<Riders />} />
                </>
              )}
              {/* Restaurant routes */}
              {role === 2 && (
                <>
                  <Route path="/restaurant-DashBoard" element={<RestaurantDashBoard />} />
                  <Route path="/restaurant-Orders" element={<RestaurantOrder />} />
                  <Route path="/restaurant-Order-History" element={<RestaurantOrderHistory />} />
                  <Route path="/restaurant-Review" element={<RestaurantReview />} />
                  <Route path="/restaurant-Menu" element={<RestaurantMenu />} />
                  <Route path="/add-Menu" element={<AddMenu />} />
                </>
              )}
            </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppNavigation;
