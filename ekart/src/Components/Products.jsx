import React, { useContext } from "react";
import { AppContext } from "../Context/appContext";
import ProductCard from "./ProductCard";
import Shimmer from "../Shimmer";
import Styles from "../Modules/Products.module.css";

function Products() {
  const { filteredProducts, productsLoading } = useContext(AppContext);

  if (productsLoading) {
    return (
      <div className={Styles.container}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Shimmer width="100%" height="200px" radius="10px" />
            <div className="py-3">
              <Shimmer width="70%" height="20px" radius="6px" />
              <div className="mt-2">
                <Shimmer width="50%" height="18px" radius="6px" />
              </div>
              <div className="mt-4">
                <Shimmer width="30%" height="22px" radius="6px" />
              </div>
              <div className="flex gap-3 mt-4">
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
    <div className={Styles.container}>
      {filteredProducts?.length > 0 ? (
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
