import React from "react";
import { NavLink } from "react-router-dom";



function RelatedProducts({ relatedProducts }) {


  return (
    <div style={styles.relatedSection}>
      <h2 style={styles.relatedHeading}>Related Products</h2>

      <div style={styles.relatedWrapper}>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <NavLink
              key={product._id}
              style={styles.card}
              to={ `/product/detail/${product._id}`}
             
            >
              <img
                src={
                  product.images?.[0]?.url || "https://via.placeholder.com/200"
                }
                alt={product.name}
                style={styles.image}
              />

              <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.price}>₹ {product.price}</p>
                <p style={styles.rating}>⭐ {product.rating || "N/A"}</p>
              </div>
            </NavLink>
          ))
        ) : (
          <p style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
            No related products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;

/* ------------------ STYLES ------------------ */

const styles = {
  relatedSection: {
    padding: "10px 20px",
    marginTop: "20px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  },

  relatedHeading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
  },

  relatedWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    maxHeight: "80vh",
    overflowY: "auto",
    paddingBottom: "10px",
  },

  card: {
    width: "200px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    margin: "10px",
    textDecoration: "none",
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },

  info: {
    padding: "10px",
  },

  name: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#000",
  },

  price: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2b8a3e",
    marginBottom: "4px",
  },

  rating: {
    fontSize: "14px",
    color: "#666",
  },
};
