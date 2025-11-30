// src/Components/RelatedProducts.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import Styles from "../Modules/RelatedProducts.module.css";

function RelatedProducts({ relatedProducts }) {
  return (
    <div className={Styles.relatedSection}>
      <h2 className={Styles.relatedHeading}>Related Products</h2>

      <div className={Styles.relatedWrapper}>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <NavLink
              key={product._id}
              className={Styles.card}
              to={`/product/detail/${product._id}`}
            >
              <img
                src={
                  product.images?.[0]?.url || "https://via.placeholder.com/200"
                }
                alt={product.name}
                className={Styles.image}
              />

              <div className={Styles.info}>
                <h3 className={Styles.name}>{product.name}</h3>
                <p className={Styles.price}>₹ {product.price}</p>
                <p className={Styles.rating}>⭐ {product.rating || "N/A"}</p>
              </div>
            </NavLink>
          ))
        ) : (
          <p className={Styles.noRelated}>No related products found.</p>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;
