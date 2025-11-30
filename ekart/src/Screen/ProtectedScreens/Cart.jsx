import { useContext, useEffect, useState } from "react";
import CartCard from "../../Components/CartCard";
import { useNavigate } from "react-router-dom";

import { fetchCart, updateQuantity, deleteCartItem } from "../../Utils/Cart";
import { AppContext } from "../../Context/appContext";

import Styles from "../../Modules/Cart.module.css";

function Cart() {
  const navigate = useNavigate();
  const { cartarray, setCartArray } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const items = await fetchCart();
      setCartArray(items);
      setLoading(false);
    }
    load();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    const updated = await updateQuantity(productId, quantity);
    setCartArray(updated);
  };

  const handleDelete = async (productId) => {
    const updated = await deleteCartItem(productId);
    setCartArray(updated);
  };

  const subtotal = Array.isArray(cartarray)
    ? cartarray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <div className={Styles.container}>
      <div className={Styles.subtotal}>
        <h2>Subtotal:</h2>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className={Styles.items}>
        {loading ? (
          <p>Loading cart...</p>
        ) : cartarray.length > 0 ? (
          <>
            {cartarray.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}

            <button
              className={Styles.checkoutBtn}
              onClick={() => {
                sessionStorage.setItem("cartArray", JSON.stringify(cartarray));
                sessionStorage.removeItem("buyNowArray");
                navigate("/address");
              }}
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
