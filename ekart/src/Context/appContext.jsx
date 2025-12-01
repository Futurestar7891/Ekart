import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

function ContextProvider({ children }) {
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [isLoggedIn, setIsLoggedIn] = useState("loading");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  // ACTIVE CATEGORY — load from session
  const [activeCategory, setActiveCategory] = useState(
    sessionStorage.getItem("activeCategory") || "All"
  );

  // CATEGORY FILTER OPTIONS (from backend)
  const [categoryFilters, setCategoryFilters] = useState([]);

   const [cartarray, setCartArray] = useState([]);
   

   const [orders,setOrders]=useState([]);

  /* ------------ SAVE ACTIVE CATEGORY ------------ */
  useEffect(() => {
    sessionStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);

  /* ------------ UPDATE FILTERED PRODUCTS WHEN CATEGORY OR PRODUCTS CHANGE ------------ */
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) =>
          p.category?.trim().toLowerCase() ===
          activeCategory.trim().toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [products, activeCategory]);

  return (
    <AppContext.Provider
      value={{

        loading,
        setLoading,

        error,
        setError,

        isLoggedIn,
        setIsLoggedIn,

        categoriesLoading,
        setCategoriesLoading,

        productsLoading,
        setProductsLoading,

        user,
        setUser,

        products,
        setProducts,

        filteredProducts,
        setFilteredProducts, 

        categories,
        setCategories,

        activeCategory,
        setActiveCategory,

        categoryFilters,
        setCategoryFilters,

        cartarray,
        setCartArray,

        orders,
        setOrders
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default ContextProvider;
