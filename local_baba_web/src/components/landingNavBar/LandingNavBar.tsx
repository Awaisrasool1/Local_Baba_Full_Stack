import React from "react";
import Theme from "../../theme/Theme";

const LandingNavBar: React.FC = () => {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm">
      <div
        className="d-flex justify-content-between align-items-center w-100"
        style={{ paddingLeft: 50, paddingRight: 50 }}
      >
        <a href="#" className="navbar-brand d-flex align-items-center">
          <img
            src={Theme.icons.AppLogo}
            alt="Local Baba Logo"
            style={{ width: "70px" }}
          />
        </a>
        <div>
          <a
            className="btn  px-4"
            style={{ backgroundColor: "#242B47", color: "white" }}
            href="/loginScreen"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavBar;
