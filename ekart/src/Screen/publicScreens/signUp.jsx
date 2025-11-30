import { useState, useContext } from "react";
import Loginsignup from "../../assets/Loginsignup.webp";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/appContext";
import VerifyOtp from "./VerifyOtp";

import Styles from "../../Modules/SignUp.module.css";

// REGEX validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Signup = () => {
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP popup
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // VALIDATE FIELDS
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number & special character";
    }

    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    if (!accepted) {
      newErrors.policy = "You must accept terms & privacy policy";
    }

    return newErrors;
  };

  // SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setOtpError("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register/send-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmpassword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ general: data.message });
        return;
      }

      setShowOtpPopup(true); // open OTP popup
    } catch (err) {
      setErrors({ general: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (finalOtp) => {
    setOtpError("");

    try {
      const res = await fetch(`${API}/auth/register/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setOtpError(data.message || "Invalid OTP");
        return;
      }

      setUser(data.user);
      setIsLoggedIn(true);
      setShowOtpPopup(false);

      navigate("/", { replace: true });
    } catch (err) {
      setOtpError("Network error");
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    setOtpError("");

    try {
      const res = await fetch(`${API}/auth/register/send-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmpassword,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setOtpError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError("Network error");
    }
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.grid}>
        {/* IMAGE */}
        <div className={Styles.imageWrapper}>
          <img src={Loginsignup} alt="signup" className={Styles.image} />
        </div>

        {/* FORM */}
        <div className={Styles.card}>
          <h2 className={Styles.title}>Create an Account</h2>
          <p className={Styles.subtitle}>Join us and start your journey!</p>

          {errors.general && (
            <p className={Styles.errorGeneral}>{errors.general}</p>
          )}

          {/* NAME */}
          <div className={Styles.field}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={Styles.input}
            />
            {errors.name && <p className={Styles.error}>{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div className={Styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={Styles.input}
            />
            {errors.email && <p className={Styles.error}>{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className={Styles.field}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={Styles.input}
            />
            {errors.password && (
              <p className={Styles.error}>{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={Styles.field}>
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              className={Styles.input}
            />
            {errors.confirmpassword && (
              <p className={Styles.error}>{errors.confirmpassword}</p>
            )}
          </div>

          {/* TERMS */}
          <div className={Styles.checkboxRow}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className={Styles.checkbox}
            />
            <p className={Styles.terms}>
              By signing up, you agree to our <strong>Terms</strong> and{" "}
              <strong>Privacy Policy</strong>.
            </p>
          </div>
          {errors.policy && <p className={Styles.error}>{errors.policy}</p>}

          {/* SIGNUP BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading || !accepted}
            className={`${Styles.button} ${
              accepted ? Styles.buttonActive : Styles.buttonDisabled
            }`}
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>

          {/* LOGIN LINK */}
          <p className={Styles.bottomText}>
            Already have an account?
            <NavLink to="/signin" className={Styles.link}>
              {" "}
              Sign In
            </NavLink>
          </p>
        </div>
      </div>

      {/* OTP POPUP */}
      {showOtpPopup && (
        <VerifyOtp
          onClose={() => setShowOtpPopup(false)}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          error={otpError}
        />
      )}
    </div>
  );
};

export default Signup;
