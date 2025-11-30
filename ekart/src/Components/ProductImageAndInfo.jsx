// src/Components/ProductImageAndInfo.jsx
import React, { useContext, useState, useEffect } from "react";
import { addToCart } from "../Utils/Cart";
import { AppContext } from "../Context/appContext";
import { useNavigate } from "react-router-dom";
import Styles from "../Modules/ProductImageAndInfo.module.css";

function ProductImagesAndInfo({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn, setCartArray, cartarray } = useContext(AppContext);

  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);

  // CHECK ALREADY ADDED
  useEffect(() => {
    if (Array.isArray(cartarray)) {
      const isAdded = cartarray.some(
        (item) => item.productId?.toString() === product._id.toString()
      );
      setAdded(isAdded);
    }
  }, [cartarray, product._id, isLoggedIn]);

  // ADD TO CART
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

  // BUY NOW
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
    sessionStorage.removeItem("cartArray");

    navigate("/address");
  };

  return (
    <div className={Styles.container}>
      {/* LEFT IMAGE SECTION */}
      <div className={Styles.left}>
        <img
          src={product.images?.[index]?.url}
          alt={product.name}
          className={Styles.mainImage}
        />

        <div className={Styles.thumbnailRow}>
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt="thumb"
              className={
                index === idx
                  ? Styles.activeThumbnail
                  : Styles.notActiveThumbnail
              }
              onClick={() => setIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={Styles.right}>
        <div className={Styles.rightContent}>
          <h1 className={Styles.title}>{product.name}</h1>
          <p className={Styles.description}>{product.description}</p>

          <div className={Styles.ratingStockRow}>
            <span className={Styles.ratingBadge}>⭐ {product.rating}</span>
            <span className={Styles.stockBadge}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <h2 className={Styles.price}>₹ {product.price}</h2>

          <div className={Styles.buttonColumn}>
            <button
              className={`${Styles.button} ${Styles.addToCart} ${
                added ? Styles.addedDisabled : ""
              }`}
              disabled={added}
              onClick={handleAddToCart}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>

            <button
              className={`${Styles.button} ${Styles.buyNow}`}
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
