import React, { useState } from "react";
import { CustomButton, CustomInput } from "../../../components";
import Theme from "../../../theme/Theme";
import { Lock, Mail } from "lucide-react";
import "./Login.css";
const LoginScreen: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setInputValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "email") {
        if (!/\S+@\S+\.\S+/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "",
          }));
        }
      }

      if (field === "password") {
        if (value.length < 6) {
          setErrors((prev) => ({
            ...prev,
            password: "Password must be at least 6 characters long.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "",
          }));
        }
      }
    };

    const handleSubmit = () => {
      if (errors.email || errors.password) {
        return; 
      }
  
      console.log("Email:", inputValues.email);
      console.log("Password:", inputValues.password);
    };
  return (
    <div className="login-container d-flex justify-content-between align-items-center vh-100 bg-light">
      <div
        className="login-left d-none d-md-flex align-items-center justify-content-center animate__animated animate__fadeInLeft"
        style={{ flex: 1 }}
      >
        <img
          src={Theme.icons.loginLogo}
          alt="Illustration"
          className="img-fluid p-5 floating-image"
          style={{ maxWidth: "80%" }}
        />
      </div>

      <div
        className="login-right d-flex align-items-center justify-content-center animate__animated animate__fadeInRight"
        style={{ flex: 1 }}
      >
        <div
          className="login-card shadow-lg p-4 p-md-5 bg-white rounded-4"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          <div className="login-header mb-4 text-center animate__animated animate__fadeInDown">
            <img
              src={Theme.icons.AppLogo}
              alt="Logo"
              className="mb-4 scale-in"
              width={120}
              height="auto"
            />
            <h2 className="fw-bold text-primary mb-1">Welcome Back!</h2>
            <p className="text-muted">Please login to your account</p>
          </div>

          <form className="slide-up">
            <div className="form-group mb-4">
              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                error={errors.email}
                value={inputValues.email}
                onChange={handleInputChange("email")}
                icon={<Mail className="text-primary" size={18} />}
              />
            </div>

            <div className="form-group mb-4">
              <CustomInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password}
                value={inputValues.password}
                onChange={handleInputChange("password")}
                icon={<Lock className="text-primary" size={18} />}
              />
            </div>

            <div className="d-flex justify-content-between mb-4 scale-in">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input border-primary"
                  id="rememberMe"
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="rememberMe"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-primary text-decoration-none hover-underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="slide-up-delay">
              <CustomButton
                title="Sign In"
                onPress={() => handleSubmit()}
                // className="btn-lg w-100 mb-4"
              />
            </div>
          </form>

          <div className="text-center mt-4 fade-in-delay">
            <p className="text-muted">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-primary text-decoration-none fw-bold hover-underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
