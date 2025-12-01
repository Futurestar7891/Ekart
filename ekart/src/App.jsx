import { useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppContext } from "./Context/appContext";
import { checkAuth } from "./Utils/User";
// import Shimmer from "./Shimmer";
import ProtectedRoutes from "./routes/protectedRoutes";

// 🔥 LAZY LOADED COMPONENTS
const Home = lazy(() => import("./Screen/publicScreens/Home"));
const ProductDetail = lazy(() =>
  import("./Screen/ProtectedScreens/ProductDetail")
);
const Cart = lazy(() => import("./Screen/ProtectedScreens/Cart"));
const Address = lazy(() => import("./Screen/ProtectedScreens/Address"));
const Success = lazy(() => import("./Screen/ProtectedScreens/Success"));
const Orders = lazy(() => import("./Screen/ProtectedScreens/Orders"));
const SignUp = lazy(() => import("./Screen/publicScreens/signUp"));
const SignIn = lazy(() => import("./Screen/publicScreens/signIn"));
const ResetPassword = lazy(() =>
  import("./Screen/publicScreens/ResetPassword")
);
const About=lazy(()=>import("./Screen/publicScreens/About"));
const Showcase=lazy(()=>import("./Screen/publicScreens/Showcase"))
const Settings = lazy(() => import("./Screen/ProtectedScreens/Settings"));

import { fetchProducts, fetchFilters } from "./Utils/Products";

function App() {

  const {
    setLoading,
    setError,
    isLoggedIn,
    setIsLoggedIn,
    setProductsLoading,
    setCategoriesLoading,
    setUser,
    setProducts,
    setCategories,
    setCategoryFilters,
  } = useContext(AppContext);

  


  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    checkAuth(setLoading, setError, setIsLoggedIn, setUser);
  }, []);


  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true); // start loading

        const productArray = await fetchProducts();

        if (!productArray || !Array.isArray(productArray)) {
          throw new Error("Failed to load products");
        }

        setProducts(productArray);

        const uniqueCategories = [
          "All",
          ...new Set(
            productArray
              .map((p) => p.category?.toLowerCase()?.trim())
              .filter((c) => c && c !== "")
          ),
        ];

        if (productArray.length === 0) {
          uniqueCategories.shift();
        }

        setCategories(uniqueCategories);
      } catch (err) {
        console.log("Product load failed:", err);
      } finally {
        setProductsLoading(false); // only turn off AFTER try/catch finishes
        setCategoriesLoading(false);
      }
    }

    loadProducts();
  }, [isLoggedIn]);

  /* ---------------- LOAD FILTER OPTIONS ---------------- */
  useEffect(() => {
    async function loadFilters() {
      const filters = await fetchFilters();
      setCategoryFilters(filters);
    }

    loadFilters();
  }, [isLoggedIn]);

  return (
    <div style={{ width: "100vw" }}>
      <Suspense fallback={null}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/showcase" element={<Showcase/>}/>
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/cart"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <Cart />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/address"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <Address />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <Success />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <Orders />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <Settings />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
