import React from "react";
import Theme from "../../theme/Theme";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-dark py-4 mt-5">
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <img src={Theme.icons.AppLogo} className='w-25 mb-3'/>
            <h5>Get in Touch</h5>
            <p>Question or feedback? We'd love to hear from you</p>
          </div>
          <div className="col-md-3">
            <h5>About</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Menu
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark">
                  Why Local Baba?
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Partner With Us
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark">
                  Account
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
