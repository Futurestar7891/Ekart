import React, { useState, useContext } from "react";
import Loginsignup from "../../assets/Loginsignup.webp";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/appContext";
import VerifyOtp from "./VerifyOtp";

import Styles from "../../Modules/SignIn.module.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AppContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState("");

  /* --------------------  HANDLE INPUT  -------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  /* --------------------  VALIDATION  -------------------- */
  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email.trim()))
      newErrors.email = "Invalid email format";

    if (!formData.password.trim()) newErrors.password = "Password is required";

    return newErrors;
  };

  /* --------------------  SUBMIT LOGIN  -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateLogin();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ general: data.message || "Invalid credentials" });
        return;
      }

      setUser(data.user);
      setIsLoggedIn(true);

      navigate("/", { replace: true });
    } catch (err) {
      setErrors({ general: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------  FORGOT PASSWORD - SEND OTP  -------------------- */
  const handleForgot = async () => {
    setErrors({});

    if (!formData.email.trim())
      return setErrors({ email: "Email is required" });

    if (!emailRegex.test(formData.email.trim()))
      return setErrors({ email: "Invalid email format" });

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/forgot/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ email: data.message || "Email not found" });
        return;
      }

      setShowOtpPopup(true);
    } catch (err) {
      setErrors({ general: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------  VERIFY OTP  -------------------- */
  const verifyForgotOtp = async (otp) => {
    setOtpError("");

    try {
      const res = await fetch(`${API}/auth/forgot/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setOtpError(data.message || "Invalid OTP");
        return;
      }

      navigate(`/reset-password?email=${formData.email}`);
    } catch (err) {
      setOtpError("Network error");
    }
  };

  const resendOtp = () => handleForgot();

  return (
    <div className={Styles.page}>
      <div className={Styles.grid}>
        {/* ----------------- IMAGE ----------------- */}
        <div className={Styles.imageWrapper}>
          <img src={Loginsignup} alt="login" className={Styles.image} />
        </div>

        {/* ----------------- FORM ----------------- */}
        <div className={Styles.card}>
          <form onSubmit={handleSubmit}>
            <h1 className={Styles.title}>Sign in</h1>
            <p className={Styles.subtitle}>
              Login and explore your favourite products.
            </p>

            {errors.general && (
              <p className={Styles.errorGeneral}>{errors.general}</p>
            )}

            {/* EMAIL */}
            <div className={Styles.field}>
              <label className={Styles.label}>Email</label>
              <input
                type="email"
                name="email"
                className={Styles.input}
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className={Styles.error}>{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className={Styles.field}>
              <label className={Styles.label}>Password</label>
              <input
                type="password"
                name="password"
                className={Styles.input}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className={Styles.error}>{errors.password}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <p className={Styles.forgot} onClick={handleForgot}>
              Forgot password?
            </p>

            {/* BUTTON */}
            <button type="submit" className={Styles.button} disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </button>

            {/* SIGNUP LINK */}
            <p className={Styles.bottomText}>
              Don’t have an account?
              <NavLink to="/signup" className={Styles.link}>
                Register here
              </NavLink>
            </p>
          </form>
        </div>
      </div>

      {/* OTP POPUP */}
      {showOtpPopup && (
        <VerifyOtp
          onClose={() => setShowOtpPopup(false)}
          onVerify={verifyForgotOtp}
          onResend={resendOtp}
          error={otpError}
        />
      )}
    </div>
  );
}

export default SignIn;
