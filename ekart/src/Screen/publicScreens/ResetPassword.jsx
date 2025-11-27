import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loginsignup from "../../assets/Loginsignup.webp";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ResetPassword() {
    const API = import.meta.env.API;
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get("email");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  /* ------------------------ FRONTEND VALIDATION ------------------------ */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be 8+ chars incl. uppercase, lowercase, number & special char";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  /* ------------------------ HANDLE SUBMIT ------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/forgot/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ general: data.message || "Unable to reset password" });
        return;
      }

      alert("Password reset successful! Login again.");
      navigate("/signin");
    } catch (err) {
      setErrors({ general: "Network error", err });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------ SHOW/HIDE PASSWORD ------------------------ */
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* LEFT IMAGE */}
          <div style={styles.imageWrapper}>
            <img src={Loginsignup} alt="reset" style={styles.image} />
          </div>

          {/* RIGHT FORM */}
          <div style={styles.card}>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>
              Create a new password for <b>{email}</b>
            </p>

            {errors.general && (
              <p style={styles.errorGeneral}>{errors.general}</p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* NEW PASSWORD */}
              <div style={styles.field}>
                <label style={styles.label}>New Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="newPassword"
                    style={styles.input}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <span
                    style={styles.eye}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </span>
                </div>
                {errors.newPassword && (
                  <p style={styles.error}>{errors.newPassword}</p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    style={styles.input}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    style={styles.eye}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p style={styles.error}>{errors.confirmPassword}</p>
                )}
              </div>

              {/* SUBMIT */}
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Please wait..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

/* ------------------------ STYLES ------------------------ */

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
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "12px 40px 12px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f1f5f9",
    fontSize: "14px",
    color: "black",
  },

  eye: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    fontSize: "18px",
  },

  error: {
    fontSize: "12px",
    color: "red",
    marginTop: "4px",
  },

  errorGeneral: {
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
    color: "#b91c1c",
    marginBottom: "10px",
    textAlign: "center",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
