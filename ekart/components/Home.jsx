import { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 

  return (
    <div style={style.mainContainer}>
      <div style={style.header}>
        <h2 style={style.heading}>Product Listing</h2>
        <button onClick={() => navigate("/cart")} style={style.cartButton}>
          Cart Items
        </button>
      </div>

      <div style={style.gridContainer}>
        {loading ? (
          <p style={style.message}>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onCartChange={fetchProducts}
            />
          ))
        ) : (
          <p style={style.message}>No products available</p>
        )}
      </div>
    </div>
  );
}

export default Home;

const style = {
  mainContainer: {
    width: "90vw",
    margin: "0 auto",
    padding: "4vh 2vw",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4vh",
  },
  heading: {
    fontSize: "2.5vw",
    color: "#333",
  },
  cartButton: {
    padding: "1.2vh 2vw",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "0.6vw",
    fontWeight: "bold",
    fontSize: "1vw",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(22vw, 1fr))",
    gap: "2vw",
  },
  message: {
    fontSize: "1.2vw",
    color: "#777",
  },
};
