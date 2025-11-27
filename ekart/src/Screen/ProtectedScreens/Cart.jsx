import { useContext, useEffect, useState } from "react";
import CartCard from "../../Components/CartCard";
import { useNavigate } from "react-router-dom";


import {
  fetchCart,
  updateQuantity,
  deleteCartItem,
  // checkout,
} from "../../Utils/Cart";
import { AppContext } from "../../Context/appContext";

function Cart() {
 const navigate=useNavigate();
 const {cartarray,setCartArray}=useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Load Cart
  useEffect(() => {
    async function load() {
      const items = await fetchCart();
      setCartArray(items);
      setLoading(false);
    }
    load();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    const items = await updateQuantity(productId, quantity);
    setCartArray(items);
  };

  const handleDelete = async (productId) => {
    const items = await deleteCartItem(productId);
    setCartArray(items);
  };

 const subtotal = Array.isArray(cartarray)
   ? cartarray.reduce((sum, item) => sum + item.price * item.quantity, 0)
   : 0;


  // CHECKOUT
  // const handleCheckout = async () => {
  //   const data = await checkout(cartarray, "vermav12346@gmail.com");
  //   if (data?.url) window.location.href = data.url;
  //   else alert("Checkout failed.");
  // };

  return (
    <div style={styles.container}>
      <div style={styles.subtotal}>
        <h2>Subtotal:</h2>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div style={styles.items}>
        {loading ? (
          <p>Loading cart items...</p>
        ) : cartarray.length > 0 ? (
          <>
            {cartarray.map((item) => (
              <div>
                <CartCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDelete}
                />
              </div>
            ))}

            <button onClick={()=>{
               sessionStorage.setItem("cartArray", JSON.stringify(cartarray));
               sessionStorage.removeItem("buyNowArray");
               navigate("/address")} }style={styles.checkoutBtn}>Proceed to Checkout</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Cart;

const styles = {
  container: {
    width: "90vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    padding: "4vh 2vw",
    justifyContent: "flex-start",
    boxSizing: "border-box",
    alignItems: "flex-start",
  },
  subtotal: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.5vw",
    fontWeight: "bold",
    borderBottom: "0.1vw solid #ccc",
    paddingBottom: "1vh",
    marginBottom: "2vh",
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: "2vh",
    width:"100%"
  },
};
