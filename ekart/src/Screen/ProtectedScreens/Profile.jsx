import React from "react";
import styles from "../../Modules/Profile.module.css";
import { NavLink } from "react-router-dom";
import { LogOut, Settings, ShoppingBag } from "lucide-react";

function Profile({ user, setUser, setIsLoggedIn, setShowProfile,showProfile }) {
  const API = import.meta.env.VITE_API;

  const onLogout = async () => {
    try {
      const res = await fetch(`${API}/auth/logout`, {
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

  const getLetterAvatar = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.profileCard}>
      {/* USER INFO */}
      <div className={styles.userInfo} onClick={()=>setShowProfile(!showProfile)}>
        {user?.image ? (
          <img src={user.image} alt="user" className={styles.userImage} />
        ) : (
          <div className={styles.userLetter}>{getLetterAvatar()}</div>
        )}

        <h4 className={styles.userName}>{user?.name}</h4>
      </div>

      {/* MENU ITEMS */}
      <div className={styles.menuList}>
        <NavLink to="/orders" className={styles.menuItem}>
          <ShoppingBag size={18} /> Orders
        </NavLink>

        <NavLink to="/settings" className={styles.menuItem}>
          <Settings size={18} /> Settings
        </NavLink>

        <button onClick={onLogout} className={styles.logoutBtn}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
