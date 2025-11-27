import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/appContext";
import { useContext, useEffect, useState } from "react";
import { addToCart } from "../Utils/Cart";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn, cartarray, setCartArray } = useContext(AppContext);
  const [added, setAdded] = useState(false);

  // Check if already in cart (persists after refresh)
  useEffect(() => {
    if (Array.isArray(cartarray)) {
      const isAdded = cartarray.some(
        (item) => item.productId?.toString() === product._id.toString()
      );
      setAdded(isAdded);
    }
  }, [cartarray, product._id, isLoggedIn]);

  /* -------------------- BUY NOW FUNCTION -------------------- */
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Please sign in first");
      return;
    }

    const singleProduct = [
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url,
      },
    ];

    sessionStorage.setItem("buyNowArray", JSON.stringify(singleProduct));

    // Optional: clear normal cart checkout data
    sessionStorage.removeItem("cartArray");

    navigate("/address");
  };

  /* -------------------- ADD TO CART -------------------- */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Please sign in first");
      return;
    }

    const body = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
    };

    try {
      const res = await addToCart(body);

      if (!res || !Array.isArray(res)) {
        alert("Failed to add item");
        return;
      }

      setCartArray(res);
      setAdded(true);
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Could not add item");
    }
  };

  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    content: {
      padding: "15px",
      flex: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.2s ease",
    },
    addDefault: {
      backgroundColor: "#000",
      color: "#fff",
    },
    addedDisabled: {
      backgroundColor: "#ccc",
      color: "#555",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    buyNow: {
      backgroundColor: "#ff4d4d",
      color: "#fff",
    },
  };

  return (
    <NavLink
      to={`/product/detail/${product._id}`}
      style={styles.card}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
        alt={product.name}
        style={styles.image}
      />

      <div style={styles.content}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{product.name}</h2>

        <p style={{ fontSize: "14px", color: "#555" }}>{product.description}</p>

        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          ₹ {product.price}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={added}
            style={{
              ...styles.button,
              ...(added ? styles.addedDisabled : styles.addDefault),
            }}
          >
            {added ? "Added ✓" : "Add To Cart"}
          </button>

          {/* BUY NOW */}
          <button
            style={{ ...styles.button, ...styles.buyNow }}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </NavLink>
  );
}

export default ProductCard;
