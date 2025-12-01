// src/components/Navbar.jsx
import React, { useEffect, useState, useContext } from "react";
import styles from "../Modules/Navbar.module.css";
import Logo from "../assets/Logo.png";
import { AppContext } from "../Context/appContext";
import { NavLink, useNavigate } from "react-router-dom";
import Suggestionbox from "./Suggesionbox";
import Profile from "../Screen/ProtectedScreens/Profile";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    products,
    setSearch,
    setActiveCategory,
    user,
    setUser,
    setIsLoggedIn,
    cartarray,
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cartcount, setCartCount] = useState(0);

  const activelink = localStorage.getItem("activelink");

  useEffect(() => {
    setCartCount(Array.isArray(cartarray) ? cartarray.length : 0);
  }, [cartarray]);

  const getLetterAvatar = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className={styles.headerWrapper}>
      {/* TOP NAV */}
      <section className={styles.topNav}>
        {/* LOGO */}
        <div className={styles.logoSection} onClick={() => navigate("/")}>
          <img src={Logo} alt="logo" className={styles.logoImage} />
        </div>

        {/* SEARCH SECTION */}
        {/* SEARCH SECTION */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search for Clothes, Beauty, Electronics, Phones..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />

          {/* DESKTOP Suggestions */}
          <div className={styles.desktopSuggestionWrapper}>
            <Suggestionbox
              query={searchText}
              products={products}
              setSearch={(txt) => {
                setSearch(txt);
                sessionStorage.setItem("search", txt);
              }}
              setSearchText={setSearchText}
              setActiveCategory={setActiveCategory}
            />
          </div>
        </div>

        {/* MOBILE Suggestions */}
        <div className={styles.mobileSuggestionWrapper}>
          <Suggestionbox
            query={searchText}
            products={products}
            setSearch={(txt) => {
              setSearch(txt);
              sessionStorage.setItem("search", txt);
            }}
            setSearchText={setSearchText}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          {/* Desktop Links */}
          <div className={styles.linksSection}>
            <NavLink
              onClick={() => localStorage.setItem("activelink", "Home")}
              to="/"
              className={
                activelink === "Home" ? styles.activeLink : styles.inactiveLink
              }
            >
              Home
            </NavLink>

            <NavLink
              onClick={() => localStorage.setItem("activelink", "About")}
              to="/about"
              className={
                activelink === "About" ? styles.activeLink : styles.inactiveLink
              }
            >
              About
            </NavLink>

            <NavLink
              onClick={() => localStorage.setItem("activelink", "Showcase")}
              to="/showcase"
              className={
                activelink === "Showcase"
                  ? styles.activeLink
                  : styles.inactiveLink
              }
            >
              Showcase
            </NavLink>
          </div>

          {/* USER SECTION */}
          <div className={styles.userSection}>
            {/* CART */}
            {isLoggedIn && (
              <div
                className={styles.cartIconWrapper}
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className={styles.cartIcon} />
                <span className={styles.cartCount}>{cartcount}</span>
              </div>
            )}

            {/* PROFILE */}
            {isLoggedIn ? (
              <div
                className={styles.profileWrapper}
                onClick={() => setShowProfile(!showProfile)}
              >
                {user?.image ? (
                  <img src={user.image} className={styles.profileImage} />
                ) : (
                  <div className={styles.profileLetter}>
                    {getLetterAvatar()}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className={styles.signInBtn}
              >
                SignIn
              </button>
            )}

            {/* MOBILE MENU ICON */}
            <span
              className={styles.menuButton}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </span>
          </div>
        </div>
      </section>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <p
            className={
              activelink === "Home" ? styles.activeLink : styles.inactiveLink
            }
            onClick={() => {
              localStorage.setItem("activelink", "Home");
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Home
          </p>

          <p
            className={
              activelink === "About" ? styles.activeLink : styles.inactiveLink
            }
            onClick={() => {
              localStorage.setItem("activelink", "About");
              navigate("/about");
              setMenuOpen(false);
            }}
          >
            About
          </p>

          <p
            className={
              activelink === "Showcase"
                ? styles.activeLink
                : styles.inactiveLink
            }
            onClick={() => {
              localStorage.setItem("activelink", "Showcase");
              navigate("/showcase");
              setMenuOpen(false);
            }}
          >
            Showcase
          </p>

          <div className={styles.moblileCartProfileItem}>
            {isLoggedIn && (
              <div
                className={styles.mobileCartIconWrapper}
                onClick={() => {
                  navigate("/cart");
                  setMenuOpen(false);
                }}
              >
                <div className={styles.mobileCartCircle}>
                  <ShoppingCart className={styles.mobileCartIcon} />
                </div>
                <span className={styles.mobileCartCount}>{cartcount}</span>
              </div>
            )}

            {isLoggedIn ? (
              <div
                className={styles.mobileProfile}
                onClick={() => {
                  setShowProfile(!showProfile);
                  setMenuOpen(false);
                }}
              >
                {user?.image ? (
                  <img src={user.image} className={styles.mobileProfileImage} />
                ) : (
                  <div className={styles.mobileProfileLetter}>
                    {getLetterAvatar()}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/signin");
                  setMenuOpen(false);
                }}
                className={styles.mobileItemButton}
              >
                SignIn
              </button>
            )}
          </div>
        </div>
      )}

      {/* PROFILE PANEL */}
      {showProfile && (
        <Profile
          user={user}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
          setShowProfile={setShowProfile}
          showProfile={showProfile}
        />
      )}
    </header>
  );
};

export default Navbar;
