import { useEffect, useContext } from "react";
import { AppContext } from "../../Context/appContext";
import { NavLink } from "react-router-dom";

function Success() {
  const { setCartArray } = useContext(AppContext);

  useEffect(() => {
    // CLEAR CART (frontend)
    sessionStorage.removeItem("cartArray");
    setCartArray([]);
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Your order has been placed successfully.</p>
      <br />
      <NavLink to="/orders">View My Orders</NavLink>
    </div>
  );
}

export default Success;
