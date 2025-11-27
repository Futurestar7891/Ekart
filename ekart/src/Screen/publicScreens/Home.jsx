import React, { useContext, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Carausel from "../../Components/Carausel";
import Products from "../../Components/Products";
import FilteredProducts from "../../Components/FilteredProducts";
import { AppContext } from "../../Context/appContext";
import { fetchCart } from "../../Utils/Cart";

function Home() {
  const { activeCategory, setCartArray, isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    async function load() {
      if (!isLoggedIn) {
        setCartArray([]);
        return;
      } 

      const items = await fetchCart();

      
      if (Array.isArray(items)) {
        setCartArray(items);
      }
    }

    load();
  }, [isLoggedIn]); // 🔥 Re-run only when login status changes

  return (
    <>
      <Navbar />
      {activeCategory === "All" && <Carausel />}
      {activeCategory !== "All" ? <FilteredProducts /> : <Products />}
    </>
  );
}

export default Home;
