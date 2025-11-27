import React, { useState, useContext } from "react";
import Loginsignup from "../../assets/Loginsignup.webp";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/appContext";
import VerifyOtp from "./VerifyOtp";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

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
        if (data.errors) setErrors(data.errors);
        else setErrors({ general: data.message || "Invalid credentials" });
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

  const handleForgot = async () => {
    setErrors({});

    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setErrors({ email: "Invalid email format" });
      return;
    }

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

  /* ---------------------- VERIFY OTP ---------------------- */
  const verifyForgotOtp = async (otp) => {
    setOtpError("");

    try {
      const res = await fetch(`${API}/auth/forgot/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
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

  const resendOtp = () => {
    handleForgot();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* LEFT IMAGE */}
          <div style={styles.imageWrapper}>
            <img src={Loginsignup} alt="login" style={styles.image} />
          </div>

          {/* RIGHT FORM */}
          <div style={styles.card}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <h1 style={styles.title}>Sign in</h1>
              <p style={styles.subtitle}>
                Login and explore your favourite products.
              </p>

              {errors.general && (
                <p style={styles.errorGeneral}>{errors.general}</p>
              )}

              {/* EMAIL */}
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p style={styles.error}>{errors.email}</p>}
              </div>

              {/* PASSWORD */}
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  style={styles.input}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p style={styles.error}>{errors.password}</p>
                )}
              </div>

              {/* FORGOT PASSWORD LINK */}
              <p onClick={handleForgot} style={styles.forgotLink}>
                Forgot password?
              </p>

              {/* LOGIN BUTTON */}
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Please wait..." : "Sign In"}
              </button>

              <p style={styles.bottomText}>
                Don't have an account?
                <NavLink to="/signup" style={styles.link}>
                  {" "}
                  Register here
                </NavLink>
              </p>
            </form>
          </div>
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

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: "24px",
  },

  container: {
    width: "100%",
    maxWidth: "1100px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    alignItems: "center",
  },

  /* LEFT IMAGE */
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "12px",
  },

  /* RIGHT FORM */
  card: {
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "10px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: "14px",
    backgroundColor: "white",
    color: "black",
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  },

  errorGeneral: {
    background: "#fee2e2",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center",
    color: "#b91c1c",
  },

  forgotLink: {
    fontSize: "14px",
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "-10px",
    alignSelf: "flex-end",
  },

  button: {
    background: "#2563eb",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },

  bottomText: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "12px",
  },

  link: {
    color: "#2563eb",
    marginLeft: "4px",
  },
};
