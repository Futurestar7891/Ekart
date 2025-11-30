import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loginsignup from "../../assets/Loginsignup.webp";
import Styles from "../../Modules/ResetPassword.module.css";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ResetPassword() {
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get("email");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, number & special char";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

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
      setErrors({ general: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.grid}>
        {/* IMAGE */}
        <div className={Styles.imageWrapper}>
          <img src={Loginsignup} alt="reset" className={Styles.image} />
        </div>

        {/* FORM */}
        <div className={Styles.card}>
          <h2 className={Styles.title}>Reset Password</h2>
          <p className={Styles.subtitle}>
            Create a new password for <b>{email}</b>
          </p>

          {errors.general && (
            <p className={Styles.errorGeneral}>{errors.general}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* NEW PASSWORD */}
            <div className={Styles.field}>
              <label className={Styles.label}>New Password</label>
              <div className={Styles.inputWrapper}>
                <input
                  type={showPass ? "text" : "password"}
                  name="newPassword"
                  className={Styles.input}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <span
                  className={Styles.eye}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.newPassword && (
                <p className={Styles.error}>{errors.newPassword}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={Styles.field}>
              <label className={Styles.label}>Confirm Password</label>
              <div className={Styles.inputWrapper}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className={Styles.input}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className={Styles.eye}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className={Styles.error}>{errors.confirmPassword}</p>
              )}
            </div>

            <button className={Styles.button} type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
