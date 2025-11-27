import { useState, useContext } from "react";
import Loginsignup from "../../assets/Loginsignup.webp";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/appContext";
import VerifyOtp from "./VerifyOtp";

// Email & password validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Signup = () => {
  const API = import.meta.env.API;
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

  // Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // VALIDATION FUNCTION
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
        "Password must contain uppercase, lowercase, number & special char";
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

  // SUBMIT (Send OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setOtpError("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

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
        if (data.errors) setErrors(data.errors);
        else setErrors({ general: data.message });
        return;
      }

      // OTP sent — open popup
      setShowOtpPopup(true);
    } catch (err) {
      setErrors({ general: "Network error", err });
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (finalOtp) => {
    try {
      setOtpError("");

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

      // OTP Success → login user
      setUser(data.user);
      setIsLoggedIn(true);

      setShowOtpPopup(false);
      navigate("/", { replace: true });
    } catch (err) {
      setOtpError("Network error. Try again.", err);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    try {
      setOtpError("");

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
      setOtpError("Network error while resending OTP", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* LEFT IMAGE */}
          <div style={styles.imageWrapper}>
            <img src={Loginsignup} alt="signup" style={styles.image} />
          </div>

          {/* RIGHT FORM CARD */}
          <div style={styles.card}>
            <h2 style={styles.title}>Create an Account</h2>
            <p style={styles.subtitle}>Join us and start your journey today.</p>

            {errors.general && (
              <p style={styles.errorGeneral}>{errors.general}</p>
            )}

            {/* NAME */}
            <div style={styles.field}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div style={styles.field}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.email && <p style={styles.error}>{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div style={styles.field}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={styles.field}>
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.confirmpassword && (
                <p style={styles.error}>{errors.confirmpassword}</p>
              )}
            </div>

            {/* TERMS */}
            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                style={styles.checkbox}
              />
              <p style={styles.terms}>
                By signing up, you agree to our <strong>Terms</strong> and{" "}
                <strong>Privacy Policy</strong>.
              </p>
            </div>

            {errors.policy && <p style={styles.error}>{errors.policy}</p>}

            {/* SIGNUP BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.button,
                background: accepted ? "#2563eb" : "#9bbdf7",
                cursor: accepted ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>

            {/* LOGIN LINK */}
            <p style={styles.bottomText}>
              Already have an account?
              <NavLink to="/signin" style={styles.link}>
                {" "}
                Sign In
              </NavLink>
            </p>
          </div>
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

// ---------------- STYLES ----------------

const styles = {
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

  imageWrapper: {
    display: "flex",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "12px",
  },

  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "24px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "32px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },

  field: {
    marginBottom: "14px",
    textAlign: "left",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#f1f5f9",
    outline: "none",
    fontSize: "14px",
    color: "#000",
  },

  checkboxRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    textAlign: "left",
    marginBottom: "10px",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  terms: {
    fontSize: "13px",
    color: "#475569",
  },

  button: {
    width: "100%",
    padding: "12px",
    color: "white",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "600",
    marginTop: "10px",
  },

  error: {
    fontSize: "12px",
    color: "red",
    marginTop: "4px",
  },

  errorGeneral: {
    padding: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "10px",
  },

  bottomText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#475569",
  },

  link: {
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "4px",
  },
};
