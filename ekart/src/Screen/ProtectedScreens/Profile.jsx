import React from "react";
import { NavLink, } from "react-router-dom";
import { LogOut, Settings, ShoppingBag } from "lucide-react";

function Profile({ user, setUser, setIsLoggedIn,setShowProfile}) {

  const onLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setUser(null);
        setIsLoggedIn(false);
        setShowProfile(false);
        
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  // ▼ Generate fallback letter avatar
  const getLetterAvatar = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "100px",
        right: "20px",
        width: "220px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
        padding: "15px",
        zIndex: 100,
      }}
    >
      {/* User Info */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
        
        {user?.image ? (
          <img
            src={user.image}
            alt="user"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
        ) : (
          // If NO image → show letter avatar
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#4C6EF5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "22px",
              fontWeight: "700",
              marginRight: "10px",
            }}
          >
            {getLetterAvatar()}
          </div>
        )}

        <div>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
            {user?.name || "User Name"}
          </h4>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <NavLink
          to="/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#333",
          }}
        >
          <ShoppingBag size={18} /> Orders
        </NavLink>

        <NavLink
          to="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#333",
          }}
        >
          <Settings size={18} /> Settings
        </NavLink>

        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            padding: 0,
            color: "red",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
