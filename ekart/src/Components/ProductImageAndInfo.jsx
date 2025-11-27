import React, { useContext, useState, useEffect } from "react";
import { addToCart } from "../Utils/Cart";
import { AppContext } from "../Context/appContext";
import { useNavigate } from "react-router-dom";

function ProductImagesAndInfo({ product }) {
  const navigate=useNavigate();
  const [index, setIndex] = useState(0);
  const { isLoggedIn, setCartArray, cartarray } = useContext(AppContext);

  const [added, setAdded] = useState(false);

  /* ---------------- CHECK ALREADY ADDED ---------------- */
  useEffect(() => {
    if (Array.isArray(cartarray)) {
      const isAdded = cartarray.some(
        (item) => item.productId?.toString() === product._id.toString()
      );
      setAdded(isAdded);
    }
  }, [cartarray, product._id, isLoggedIn]);

  /* ---------------- ADD TO CART ---------------- */
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

  /* ---------------- BUY NOW ---------------- */
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

    // Save buy now product
    sessionStorage.setItem("buyNowArray", JSON.stringify(singleProduct));

    // Optional: clear old cartArray usage
    sessionStorage.removeItem("cartArray");

    navigate("/address");
  };

  return (
    <div style={styles.container}>
      {/* LEFT IMAGE SECTION */}
      <div style={styles.left}>
        <img
          src={product.images?.[index]?.url}
          alt={product.name}
          style={styles.mainImage}
        />

        <div style={styles.thumbnailRow}>
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt="thumb"
              style={
                index === idx
                  ? styles.activeThumbnail
                  : styles.notActiveThumbnail
              }
              onClick={() => setIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={styles.right}>
        <div style={styles.rightContent}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.ratingStockRow}>
            <span style={styles.ratingBadge}>⭐ {product.rating}</span>
            <span style={styles.stockBadge}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <h2 style={styles.price}>₹ {product.price}</h2>

          <div style={styles.buttonColumn}>
            <button
              style={{
                ...styles.button,
                ...styles.addToCart,
                ...(added ? { opacity: 0.6, cursor: "not-allowed" } : {}),
              }}
              disabled={added}
              onClick={handleAddToCart}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>

            <button
              style={{ ...styles.button, ...styles.buyNow }}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductImagesAndInfo;

/* ---------- STYLES ---------- */
const styles = {
  container: {
    display: "flex",
    gap: "30px",
    padding: "30px",
    minHeight: "100vh",
  },

  /* LEFT SECTION */
  left: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },

  mainImage: {
    height: "70vh",
    width: "100%",
    borderRadius: "12px",
    objectFit: "contain",
    background: "#f8f8f8",
    padding: "10px",
  },

  thumbnailRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  activeThumbnail: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #000",
    cursor: "pointer",
  },

  notActiveThumbnail: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },

  /* RIGHT SECTION */
  right: {
    width: "40%",
    padding: "25px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    display: "flex",
    justifyContent: "center",
  },

  rightContent: {
    width: "100%",
    textAlign: "center",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  description: {
    fontSize: "15px",
    color: "#555",
    marginBottom: "15px",
  },

  ratingStockRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "15px",
  },

  ratingBadge: {
    background: "#FFD700",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  stockBadge: {
    background: "#1f1f1f",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  price: {
    fontSize: "32px",
    marginTop: "10px",
    fontWeight: "700",
    color: "#000",
  },

  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "25px",
  },

  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "700",
    letterSpacing: "0.5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.2s",
  },

  addToCart: {
    background: "#000",
    color: "#fff",
  },

  buyNow: {
    background: "#ff4d4d",
    color: "#fff",
  },
};
