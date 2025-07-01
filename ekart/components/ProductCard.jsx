function ProductCard({ item, onCartChange }) {
  const userId = "testuser";

  const handleAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/additem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          item: {
            ...item,
            quantity: 1,
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Added to cart!");
        onCartChange(); // 🔁 re-fetch product list
      } else {
        alert(data.message || "❌ Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div style={styles.card}>
      <img src={item.image} alt={item.name} style={styles.image} />
      <h3 style={styles.name}>{item.name}</h3>
      <p style={styles.description}>{item.description}</p>
      <p style={styles.price}>₹{item.price}</p>
      <button
        disabled={item.addedAlready}
        style={{
          ...styles.button,
          opacity: item.addedAlready ? 0.5 : 1, // 👈 Change opacity
          cursor: item.addedAlready ? "not-allowed" : "pointer",
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "250px",
    textAlign: "center",
    margin: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  name: {
    fontSize: "18px",
    margin: "10px 0 4px",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  price: {
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ProductCard;
