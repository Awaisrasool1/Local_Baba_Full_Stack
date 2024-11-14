import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/img/logo.png";
import "./Sidebar.css";
import { PopupForm } from "../popup";
import { add_restaurant } from "../../services";
import { toast } from "react-toastify";
interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string;
  openingTime: string;
  closingTime: string;
}
const Sidebar = ({ onLogOut, sideBarItem, isAddRestaurant }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [latLong, setLatLong] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: "",
    openingTime: "",
    closingTime: "",
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const addRestaurant = async () => {
    try {
      const data = {
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phoneNumber,
        Name: formData.name,
        Image: "asdasd",
        ServiesTypeId: "1",
        Location: "00,00",
        OpeningTime: formData.openingTime,
        ClosingTime: formData.closingTime,
      };
      const res = await add_restaurant(data);
      if (res.status === "success") {
        toast(res.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          userType: "",
          openingTime: "",
          closingTime: "",
        });
        handleClose();
      } else {
        toast(res.message || "Failed to add restaurant.");
      }
    } catch (err: any) {
      console.error(err.response.data.message);
      toast.error(err.response.data.message);
    }
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

      <ul className="nav nav-pills flex-column mb-auto mt-5 ms-3">
        {sideBarItem.map((item: any, index: any) => (
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

      {isAddRestaurant && (
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
              Please organize your menus through button below!
            </p>
            <button
              className="add-restaurant-button btn btn-success w-100"
              onClick={() => handleShow()}
            >
              + Add Restaurant
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto ms-3">
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center"
          onClick={onLogOut}
        >
          <LogOut size={20} className="me-2" />
          Logout
        </button>
      </div>
      <PopupForm
        onSubmit={addRestaurant}
        setFormData={setFormData}
        formData={formData}
        show={showPopup}
        handleClose={handleClose}
        setLatLong={setLatLong}
        latLong={latLong}
      />
    </div>
  );
};

export default Sidebar;
