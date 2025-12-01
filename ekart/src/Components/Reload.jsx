import React from "react";

function Reload({ error, onRetry }) {
  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
        marginTop: "70px",
      }}
    >
      <p style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px" }}>
        {error}
      </p>

      <button
        onClick={onRetry}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        Retry
      </button>
    </div>
  );
}

export default Reload;
