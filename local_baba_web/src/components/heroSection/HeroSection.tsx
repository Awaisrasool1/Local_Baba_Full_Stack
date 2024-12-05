import React from "react";
import Theme from "../../theme/Theme";
import "./LandingHero.css"; // Add this CSS file for animations

const LandingHero: React.FC = () => {
  return (
    <section className="landing-hero bg-white position-relative">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-4 fw-bold animate-fade-in">
              Delivering <span style={{ color: "#5667AB" }}>Delicious</span>{" "}
              Moments to Your <span style={{ color: "#5667AB" }}>Doorstep</span>
            </h1>
            <p className="text-muted mt-3 animate-fade-in-delay">
              Experience a World of Flavors, Delivered to You
            </p>
          </div>

          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="position-relative">
              <img
                src={Theme.icons.landing_image}
                alt="Delicious Food"
                className="img-fluid rounded-circle animate-bounce"
                style={{ width: "70%", zIndex: 1 }}
              />
              <div className="floating-icons">
                <img
                  src={Theme.icons.chili_icon}
                  alt="Chili Icon"
                  className="position-absolute float-icon"
                  style={{ top: "20%", left: "80px", width: "70px" }}
                />
                <img
                  src={Theme.icons.clock_icon}
                  alt="Clock Icon"
                  className="position-absolute float-icon"
                  style={{ top: "50%", right: "60px", width: "70px" }}
                />
                <img
                  src={Theme.icons.fris_icon}
                  alt="Fries Icon"
                  className="position-absolute float-icon"
                  style={{ bottom: "20%", left: "20px", width: "70px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="contact-us bg-white shadow-sm rounded-pill position-absolute d-flex align-items-center animate-slide-up"
        style={{
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          width: "300px",
          justifyContent: "space-between",
        }}
      >
        <img
          src={Theme.icons.user_avatar}
          alt="User Avatar"
          className="rounded-circle me-3"
          style={{ width: "40px" }}
        />
        <div>
          <p className="mb-0 fw-bold">Contact Us</p>
          <span className="text-muted">Local Baba</span>
        </div>
        <img
          src={Theme.icons.call_icon}
          alt="User Avatar"
          className="rounded-circle me-3"
          style={{ width: "40px" }}
        />
      </div>
    </section>
  );
};

export default LandingHero;
