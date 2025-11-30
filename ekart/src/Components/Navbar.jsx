import React, { useEffect, useState } from "react";
import styles from "../Modules/Navbar.module.css";
import Logo from "../assets/Logo.png";
import { AppContext } from "../Context/appContext";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Suggestionbox from "./Suggesionbox";
import Profile from "../Screen/ProtectedScreens/Profile";
import Shimmer from "../Shimmer";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    categoriesLoading,
    categories,
    setFilteredProducts,
    products,
    setSearch,
    setActiveCategory,
    activeCategory,
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

  const filterCategory = (cat) => {
    const category = cat.trim();
    setActiveCategory(category);

    if (category === "All") return setFilteredProducts(products);

    setFilteredProducts(
      products.filter((p) => p.category?.trim() === category)
    );
  };

  const getLetterAvatar = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className={styles.headerWrapper}>
      {/* TOP NAVBAR */}
      <section className={styles.topNav}>
        {/* LOGO */}
        <div className={styles.logoSection} onClick={() => navigate("/")}>
          <img src={Logo} alt="logo" className={styles.logoImage} />
        </div>

        {/* SEARCH */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search for Clothes, Beauty, Electronics, Phones..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />

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
          {/* DESKTOP LINKS */}
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
              to="/orders"
              className={
                activelink === "About" ? styles.activeLink : styles.inactiveLink
              }
            >
              About
            </NavLink>

            <NavLink
              onClick={() => localStorage.setItem("activelink", "Contact")}
              to="#"
              className={
                activelink === "Contact"
                  ? styles.activeLink
                  : styles.inactiveLink
              }
            >
              Contact
            </NavLink>
          </div>

          {/* USER SECTION */}
          <div className={styles.userSection}>
            {/* CART — ONLY WHEN LOGGED IN */}
            {isLoggedIn && (
              <div
                className={styles.cartIconWrapper}
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className={styles.cartIcon} />
                <span className={styles.cartCount}>{cartcount}</span>
              </div>
            )}

            {/* PROFILE (deskop) — ONLY WHEN LOGGED IN */}
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
              // SIGN IN (desktop)
              <button
                onClick={() => navigate("/signin")}
                className={styles.signInBtn}
              >
                SignIn
              </button>
            )}

            {/* MOBILE MENU BUTTON */}
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
              navigate("/orders");
              setMenuOpen(false);
            }}
          >
            About
          </p>

          <p
            className={
              activelink === "Contact" ? styles.activeLink : styles.inactiveLink
            }
            onClick={() => {
              localStorage.setItem("activelink", "Contact");
              setMenuOpen(false);
            }}
          >
            Contact
          </p>

          {/* MOBILE CART + PROFILE */}
          <div className={styles.moblileCartProfileItem}>
            {/* CART ONLY IF LOGGED IN */}
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

            {/* PROFILE ONLY IF LOGGED IN */}
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
              // SIGN IN BUTTON (mobile)
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

      {/* CATEGORY BAR */}
      <div className={styles.categoryBar}>
        <ul className={styles.categoryList}>
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className={styles.categoryItem}>
                  <Shimmer height="25px" width="60px" />
                </li>
              ))
            : categories.map((cat, idx) => (
                <li key={idx} className={styles.categoryItem}>
                  <span
                    onClick={() => filterCategory(cat)}
                    className={
                      activeCategory === cat.trim()
                        ? styles.categoryActive
                        : styles.categoryLink
                    }
                  >
                    {cat}
                  </span>
                </li>
              ))}
        </ul>
      </div>

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
