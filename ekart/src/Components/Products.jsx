import React, { useContext } from "react";
import { AppContext } from "../Context/appContext";
import ProductCard from "./ProductCard";
import Shimmer from "../Shimmer";

function Products() {
  const { filteredProducts, productsLoading } = useContext(AppContext);

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "40px auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "40px",
      padding: "0 20px",
    },
  };
 console.log(productsLoading);
  // 🔥 FIX: show shimmer grid when products are loading
  if (productsLoading) {
    return (
      <div style={styles.container}>
        {/* Show 6 skeleton product cards */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Shimmer width="100%" height="200px" radius="10px" />
            <div style={{ padding: "10px 0" }}>
              <Shimmer width="70%" height="20px" radius="6px" />
              <Shimmer
                width="50%"
                height="18px"
                radius="6px"
                style={{ marginTop: "10px" }}
              />
              <Shimmer
                width="30%"
                height="22px"
                radius="6px"
                style={{ marginTop: "15px" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <Shimmer width="50%" height="40px" radius="6px" />
                <Shimmer width="50%" height="40px" radius="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {filteredProducts && filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Products;
