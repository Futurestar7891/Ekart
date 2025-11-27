import React, { useRef, useState, useEffect } from "react";

function VerifyOtp({ onClose, onVerify, onResend, error }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  /* ---------------- INPUT HANDLING ---------------- */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ---------------- VERIFY ---------------- */
  const submitOtp = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return alert("Enter complete 6-digit OTP");
    onVerify(finalOtp);
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = () => {
    if (!canResend) return;

    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(600);
    setCanResend(false);

    onResend();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Verify Email</h2>
        <p style={styles.subtitle}>Enter the 6-digit OTP sent to your email</p>

        {/* ERROR MESSAGE */}
        {error && <p style={styles.errorMsg}>{error}</p>}

        {/* OTP INPUTS */}
        <div style={styles.otpBoxContainer}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              style={styles.otpBox}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            />
          ))}
        </div>

        {/* TIMER */}
        <p style={styles.timer}>
          {canResend ? (
            <span style={{ color: "green" }}>You can resend OTP</span>
          ) : (
            <>
              Resend OTP in <b>{formatTime()}</b>
            </>
          )}
        </p>

        {/* RESEND BUTTON */}
        <button
          style={{
            ...styles.resendBtn,
            background: canResend ? "#000" : "#aaa",
            cursor: canResend ? "pointer" : "not-allowed",
          }}
          disabled={!canResend}
          onClick={handleResend}
        >
          Resend OTP
        </button>

        {/* VERIFY BUTTON */}
        <button style={styles.verifyBtn} onClick={submitOtp}>
          Verify OTP
        </button>

        <button style={styles.closeBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;

/* ---------------- STYLES ---------------- */
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },

  popup: {
    width: "380px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  },

  errorMsg: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
    fontWeight: "500",
  },

  otpBoxContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "15px",
  },

  otpBox: {
    width: "45px",
    height: "55px",
    fontSize: "24px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontWeight: "600",
    backgroundColor: "white",
    color: "black",
  },

  timer: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#444",
  },

  resendBtn: {
    width: "100%",
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "10px",
  },

  verifyBtn: {
    width: "100%",
    padding: "12px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
  },

  closeBtn: {
    width: "100%",
    padding: "10px",
    background: "#e5e5e5",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
 
};
