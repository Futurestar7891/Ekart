import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/appContext";
import VerifyOtp from "../publicScreens/VerifyOtp";
import { useNavigate } from "react-router-dom";

function Settings() {
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const { user, setIsLoggedIn } = useContext(AppContext);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  // ERROR STATES
  const [emailError, setEmailError] = useState("");
  const [emailPasswordError, setEmailPasswordError] = useState("");
  const [currentPassError, setCurrentPassError] = useState("");
  const [newPassError, setNewPassError] = useState("");

  // VALIDATION REGEX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // -------- UPLOAD PROFILE IMAGE --------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const res = await fetch(`${API}/auth/change-profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await res.json();

        if (data.success) {
          alert("Profile image updated!");
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Error uploading image");
        console.error(err);
      }
    };

    reader.readAsDataURL(file);
  };

  // -------- HANDLE EMAIL CHANGE (STEP 1: SEND OTP) --------
  const handleEmailChange = async () => {
    let valid = true;

    setEmailError("");
    setEmailPasswordError("");

    if (!emailRegex.test(newEmail)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!emailPassword.trim()) {
      setEmailPasswordError("Current password is required");
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(`${API}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });

      const data = await res.json();

      if (!data.success) return setEmailError(data.message);

      setTempEmail(newEmail);
      setShowOtp(true);
    } catch (err) {
      setEmailError("Could not send OTP");
    }
  };

  // -------- HANDLE OTP VERIFY (STEP 2: VERIFY OTP) --------
  const verifyOtp = async (otp) => {
    try {
      const res = await fetch(`${API}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp, newEmail: tempEmail }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Email updated successfully!");
        setShowOtp(false);
        window.location.reload();
      } else {
        setEmailError(data.message); // <--- ERROR STORED HERE
      }
    } catch (err) {
      setEmailError("OTP verification failed");
    }
  };

  // -------- HANDLE PASSWORD CHANGE --------
  const handlePasswordChange = async () => {
    let valid = true;

    setCurrentPassError("");
    setNewPassError("");

    if (!currentPass.trim()) {
      setCurrentPassError("Please enter current password");
      valid = false;
    }

    if (!passwordRegex.test(newPass)) {
      setNewPassError(
        "Password must be 8+ chars, include uppercase, lowercase, number & special character"
      );
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password updated!");
        setCurrentPass("");
        setNewPass("");
      } else {
        setCurrentPassError(data.message);
      }
    } catch (err) {
      setCurrentPassError("Error updating password");
    }
  };

  // -------- DELETE ACCOUNT --------
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      const res = await fetch(`${API}/auth/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(false);
        navigate("/", { replace: true });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting account");
    }
  };

  // -------- AVATAR LETTER --------
  const getLetterAvatar = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <>
      {showOtp && (
        <VerifyOtp
          onClose={() => setShowOtp(false)}
          onVerify={verifyOtp}
          onResend={handleEmailChange}
          error={emailError} // ✅ FIX: PASS ERROR TO POPUP
        />
      )}

      <div style={styles.page}>
        <h2 style={styles.title}>Settings</h2>

        {/* PROFILE */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Profile</h3>

          <div style={styles.profileRow}>
            {user?.image ? (
              <img src={user.image} style={styles.avatar} alt="profile" />
            ) : (
              <div style={styles.avatarLetter}>{getLetterAvatar()}</div>
            )}

            <div>
              <p style={styles.label}>Name</p>
              <p style={styles.value}>{user?.name}</p>

              <p style={styles.label}>Email</p>
              <p style={styles.value}>{user?.email}</p>

              <label style={styles.uploadBtn}>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* CHANGE EMAIL */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Change Email</h3>

          <input
            style={styles.input}
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && <p style={styles.error}>{emailError}</p>}

          <input
            style={styles.input}
            type="password"
            placeholder="Current Password"
            value={emailPassword}
            onChange={(e) => {
              setEmailPassword(e.target.value);
              setEmailPasswordError("");
            }}
          />
          {emailPasswordError && (
            <p style={styles.error}>{emailPasswordError}</p>
          )}

          <button style={styles.button} onClick={handleEmailChange}>
            Change Email
          </button>
        </div>

        {/* CHANGE PASSWORD */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Change Password</h3>

          <input
            style={styles.input}
            type="password"
            placeholder="Current Password"
            value={currentPass}
            onChange={(e) => {
              setCurrentPass(e.target.value);
              setCurrentPassError("");
            }}
          />
          {currentPassError && <p style={styles.error}>{currentPassError}</p>}

          <input
            style={styles.input}
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => {
              setNewPass(e.target.value);
              setNewPassError("");
            }}
          />
          {newPassError && <p style={styles.error}>{newPassError}</p>}

          <button style={styles.button} onClick={handlePasswordChange}>
            Change Password
          </button>
        </div>

        {/* DELETE ACCOUNT */}
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: "red" }}>Danger Zone</h3>

          <button style={styles.deleteBtn} onClick={deleteAccount}>
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;

/* ----------- STYLES ----------- */
const styles = {
  page: {
    padding: "30px",
    maxWidth: "600px",
    margin: "100px auto",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },

  title: { fontSize: "28px", fontWeight: "700", marginBottom: "20px" },

  section: {
    marginBottom: "35px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "20px",
  },

  sectionTitle: { fontSize: "20px", fontWeight: "600", marginBottom: "15px" },

  profileRow: { display: "flex", alignItems: "center", gap: "20px" },

  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  avatarLetter: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#4C6EF5",
    color: "white",
    fontSize: "26px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: "14px",
    color: "#777",
    marginTop: "5px",
    marginBottom: "2px",
  },

  value: { fontSize: "16px", fontWeight: "600", marginBottom: "8px" },

  uploadBtn: {
    marginTop: "10px",
    padding: "6px 12px",
    background: "black",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-block",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    backgroundColor: "white",
    color: "black",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  deleteBtn: {
    width: "100%",
    padding: "12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "-10px",
    marginBottom: "10px",
  },
};
