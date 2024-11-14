import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../services";
import Theme from "../../theme/Theme";
import { CustomButton, CustomInput } from "../../components";
import { toast, ToastContainer } from "react-toastify";

const LoginScreen = ({ onLogin }: any) => {
  const nav = useNavigate();
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (errors.email || errors.password) {
      return;
    }
    try {
      const res = await SignIn(inputValues);
      if (res.status == 200) {
        if (res.data.role == 1 || res.data.role == 2) {
          toast(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("name", res.data.name);
          onLogin(res.data.role);
        } else {
          setError('')
          toast('You do not have access to this resource');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message);
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className="login-container d-flex justify-content-between align-items-center vh-100 ">
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
            <h2 className="fw-bold mb-1" style={{ color: "#242B47" }}>
              Welcome Back!
            </h2>
            <p className="text-muted">Please login to your account</p>
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <form className="slide-up" onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                error={errors.email}
                value={inputValues.email}
                onChange={handleInputChange("email")}
                icon={<Mail style={{ color: "#242B47" }} size={18} />}
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
                icon={<Lock style={{ color: "#242B47" }} size={18} />}
              />
            </div>

            <div className="slide-up-delay">
              <CustomButton title="Sign In" onPress={() => handleSubmit} />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default LoginScreen;
