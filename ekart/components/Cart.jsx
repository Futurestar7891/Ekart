import { useEffect, useState } from "react";
import CartCard from "./CartCard";
function Cart() {
  const [cartarray, setCartArray] = useState([]);
  const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
  const userId = "testuser";
  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems: cartarray,
            email: "vermav12346@gmail.com", // Hardcoded for testing
          }),
        }
      );

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await response.json();
      setCartArray(data.cart);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/updatequantity/${userId}/${productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );
      const data = await response.json();
      setCartArray(data.cart);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/deleteitem/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setCartArray(data.cart);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const subtotal = cartarray.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    fetchCart();
  }, []);

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
              <CartCard
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}

            <button
              style={styles.checkoutBtn}
              onClick={() => handleCheckout()}
            >
              Proceed to Checkout
            </button>
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
    width:"100%",
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
  },
};
