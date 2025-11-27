import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/appContext";

import ProductImagesAndInfo from "../../Components/ProductImageAndInfo";
import RelatedProducts from "../../Components/RelatedProducts";
import ProductReviews from "../../Components/ProductReviews";
import Shimmer from "../../Shimmer";

function ProductDetail() {
  const { id } = useParams();
  const { products, productsLoading } = useContext(AppContext);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    if (products.length === 0) return;

    const found = products.find((p) => p._id === id);
    setCurrentProduct(found);
  }, [id, products]);

  /* ---------------- LOAD RELATED ---------------- */
  useEffect(() => {
    if (!currentProduct || products.length === 0) return;

    const related = products.filter(
      (p) =>
        p.category === currentProduct.category && p._id !== currentProduct._id
    );

    setRelatedProducts(related);
  }, [currentProduct, products]);

  /* ---------------- STRUCTURED SHIMMER (LIKE PRODUCT UI) ---------------- */
  if (productsLoading || !currentProduct) {
    return (
      <div style={loader.container}>
        {/* LEFT SIDE */}
        <div style={loader.left}>
          <Shimmer width="100%" height="70vh" radius="12px" />

          <div style={loader.thumbnailRow}>
            <Shimmer width="90px" height="90px" radius="10px" />
            <Shimmer width="90px" height="90px" radius="10px" />
            <Shimmer width="90px" height="90px" radius="10px" />
            <Shimmer width="90px" height="90px" radius="10px" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={loader.right}>
          <Shimmer width="70%" height="30px" radius="6px" />
          <Shimmer width="90%" height="18px" radius="6px" />
          <Shimmer width="50%" height="18px" radius="6px" />

          <div style={{ marginTop: "20px" }}>
            <Shimmer width="120px" height="40px" radius="8px" />
          </div>

          <div style={{ marginTop: "20px" }}>
            <Shimmer width="200px" height="50px" radius="8px" />
            <Shimmer width="200px" height="50px" radius="8px" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- REAL UI ---------------- */
  return (
    <div>
      <ProductImagesAndInfo product={currentProduct} />
      <RelatedProducts relatedProducts={relatedProducts} />
      <ProductReviews product={currentProduct} />
    </div>
  );
}

export default ProductDetail;

/* ---------------- SHIMMER LAYOUT STYLES ---------------- */
const loader = {
  container: {
    display: "flex",
    gap: "30px",
    padding: "30px",
    minHeight: "100vh",
  },

  left: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  thumbnailRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  right: {
    width: "40%",
    padding: "25px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    justifyContent: "flex-start",
  },
};
