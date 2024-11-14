import React, { useState } from "react";
import { Bell, Settings, Search, SortDesc, Plus } from "lucide-react";
import Theme from "../../theme/Theme";

interface Porps {
  title: string;
  subTitle: string;
}
const Navbar = (props: Porps) => {
  

  return (
    <nav className="py-3">
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div className="position-relative me-4 cursor-pointer">
              <Bell size={20} className="text-muted" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                21
              </span>
            </div>

            <div className="position-relative me-4 cursor-pointer">
              <Settings size={20} className="text-muted" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                8
              </span>
            </div>

            <div className="d-flex align-items-center">
              <div className="me-3 d-none d-md-block">
                <div className="text-end">
                  <span className="d-block">Hello,</span>
                  <strong>John Doe</strong>
                </div>
              </div>
              <img
                src={Theme.icons.AppLogo}
                alt="User Avatar"
                className="rounded-circle"
                width="40"
                height="40"
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 30 }}>
          <h3>{props.title}</h3>
          <p className="text-muted mb-0">{props.subTitle}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
