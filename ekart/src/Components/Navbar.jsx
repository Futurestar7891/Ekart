import React, { useEffect, useState} from "react";
import Logo from "../assets/Logo.png";
import { AppContext } from "../Context/appContext";
import { useContext } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import Suggestionbox from "./Suggesionbox";
import Profile from "../Screen/ProtectedScreens/Profile";
import Shimmer from "../Shimmer";

const Navbar = () => {
  const navigate=useNavigate();
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
   cartarray
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [searchText, setSearchText] = useState("");
  const [cartcount,setCartCount]=useState(null);

  const activelink = localStorage.getItem("activelink");


 useEffect(() => {
  console.log(cartarray);
   if (Array.isArray(cartarray)) {
     setCartCount(cartarray.length);
   } else {
     setCartCount(0);
   }
 }, [cartarray]);

  // Click category
  const filterCategory = (cat) => {
    const category = cat.trim();

    setActiveCategory(category);

    if (category === "All") {
      setFilteredProducts(products);
      return;
    }
    setFilteredProducts(
      products.filter((p) => p.category?.trim() === category)
    );
  };
  const getLetterAvatar = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };


  return (
    <header style={styles.headerWrapper}>
      <section style={styles.topBar}>
        {/* LOGO */}
        <a href="/" style={styles.logoContainer}>
          <img src={Logo} alt="logo" style={styles.logoLarge} />
        </a>

        <div style={styles.flexFull}>
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search for Clothes, Beauty, Electronics, Phones..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.searchInput}
          />

          <Suggestionbox
            query={searchText}
            products={products}
            setSearch={(text) => {
              setSearch(text);
              sessionStorage.setItem("search", text);
            }}
            setSearchText={setSearchText}
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
            }}
          />

          {/* MID NAV */}
          <div style={styles.midNav}>
            <NavLink
              onClick={() => localStorage.setItem("activelink", "Home")}
              to="#"
              style={
                activelink === "Home" ? styles.activeLink : styles.midNavLink
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => localStorage.setItem("activelink", "About")}
              style={
                activelink === "About" ? styles.activeLink : styles.midNavLink
              }
            >
              About
            </NavLink>
            <NavLink
              onClick={() => localStorage.setItem("activelink", "Contact")}
              to="#"
              style={
                activelink === "Contact" ? styles.activeLink : styles.midNavLink
              }
            >
              Contact
            </NavLink>
          </div>

          {/* RIGHT ICONS */}
          <div style={styles.rightContainer}>
            <ul style={styles.iconList}>
              <li style={styles.iconItem}>
                <span
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("Please sign in first");
                      return;
                    }
                    {
                      navigate("/cart");
                    }
                  }}
                  style={styles.cartWrapper}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.cartIcon}
                    viewBox="0 0 512 512"
                  >
                    <path d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0" />
                  </svg>
                  <span style={styles.cartBadge}>{cartcount}</span>
                </span>
              </li>
              {isLoggedIn ? (
                <li
                  onClick={() => setShowProfile(!showProfile)}
                  style={{ ...styles.iconItem, ...styles.userItem }}
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
                  <h3>{user?.name}</h3>
                </li>
              ) : (
                <li style={styles.iconItem}>
                  <button
                    onClick={() => {
                      navigate("/signin");
                    }}
                    style={styles.signInBtn}
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* CATEGORY LIST */}
      <div style={styles.categoryWrapper}>
        <ul style={styles.categoryList}>
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <li key={i} style={styles.categoryItem}>
                  <Shimmer
                    width={`${60 + (i % 3) * 20}px`}
                    height="25px"
                    radius="4px"
                  />
                </li>
              ))
            : categories.map((item, idx) => (
                <li key={idx} style={styles.categoryItem}>
                  <a
                    onClick={() => filterCategory(item)}
                    style={
                      activeCategory === item.trim()
                        ? styles.categoryActive
                        : styles.categoryLink
                    }
                  >
                    {item}
                  </a>
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
        />
      )}
    </header>
  );
};

export default Navbar;

/* ------------------ STYLES ------------------ */

const styles = {
  headerWrapper: {
    width: "100%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "white",
    position: "fixed",
    top: 0,
    zIndex: 50,
    letterSpacing: "0.5px",
  },


  topBar: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid #ddd",
    background: "white",
    minHeight: "70px",
  },

  logoContainer: { display: "block" },
  logoLarge: { width: "200px" },

  logoSmallContainer: { display: "none" },
  logoSmall: { width: "45px" },

  flexFull: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },

  searchInput: {
    width: "500px",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#f0f0f0",
    outline: "none",
    marginLeft: "20px",
    color: "black",
  },

  /* NEW MID NAV STYLES */
  midNav: {
    display: "flex",
    gap: "30px",
    marginLeft: "40px",
    alignItems: "center",
  },

  midNavLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },

  rightContainer: {
    marginLeft: "auto",
    marginRight: "50px",
    // border:"2px solid green"
  },

  iconList: {
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    listStyle: "none",
    gap: "20px",
    // border:"2px solid red"
  },

  iconItem: { cursor: "pointer",display:"flex",justifyContent:"center", alignItems:"center" },

  userItem:{
    //  border:"2px solid green",
  },

  cartWrapper: { position: "relative", display: "flex",alignItems:"center" },

  cartIcon: { width: "26px", height: "26px" },

  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "red",
    color: "white",
    fontSize: "10px",
    padding: "2px 5px",
    borderRadius: "50%",
  },

  signInBtn: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "1px solid #333",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "black",
  },

  categoryWrapper: {
    background: "#333",
    padding: "10px 20px",
  },

  categoryList: {
    display: "flex",
    gap: "20px",
    listStyle: "none",
    margin: 0,
  },

 

  categoryLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
  },

  categoryActive: {
    color: "#FFD700",
    textDecoration: "none",
    fontSize: "14px",
  },
  activeLink: {
    color: "blue",
    fontSize: "18px",
  },
};
