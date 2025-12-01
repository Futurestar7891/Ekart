import React, { useContext, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Carausel from "../../Components/Carausel";
import Products from "../../Components/Products";
import FilteredProducts from "../../Components/FilteredProducts";
import { AppContext } from "../../Context/appContext";
import { fetchCart } from "../../Utils/Cart";
import CategoryListing from "../../Components/CategoryListing";
import LoadingBar from "../../Components/LoadingBar";
import Reload from "../../Components/Reload";
import { checkAuth } from "../../Utils/User";


function Home() {
  const {
    activeCategory,
    setCartArray,
    isLoggedIn,
    loading,
    error,
    setLoading,
    setError,
    setIsLoggedIn,
    setUser,
  } = useContext(AppContext);

  /* ---------------- CART LOAD ---------------- */
  useEffect(() => {
    async function load() {
      if (!isLoggedIn) {
        setCartArray([]);
        return;
      }

      const items = await fetchCart();
      if (Array.isArray(items)) setCartArray(items);
    }

    load();
  }, [isLoggedIn]);

  /* ---------------- SET ACTIVE NAV ---------------- */
  useEffect(() => {
    localStorage.setItem("activelink", "Home");
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      {loading && <LoadingBar />}
      {!loading && error.length > 0 && (
        <Reload
          error={error}
          onRetry={() =>
            checkAuth(setLoading, setError, setIsLoggedIn, setUser )
          }
        />
      )}

      {!loading && error.length === 0 && (
        <>
          <CategoryListing />
          {activeCategory === "All" && <Carausel />}
          {activeCategory !== "All" ? <FilteredProducts /> : <Products />}
        </>
      )}
    </div>
  );
}

export default Home;
