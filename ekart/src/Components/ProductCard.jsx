import Styles from "../Modules/ProductCard.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/appContext";
import { useContext, useEffect, useState } from "react";
import { addToCart } from "../Utils/Cart";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn, cartarray, setCartArray } = useContext(AppContext);
  const [added, setAdded] = useState(false);
  console.log("jhfkjdfd",product);
  useEffect(() => {
    if (Array.isArray(cartarray)) {
      const isAdded = cartarray.some((item) => item.productId === product._id);
      setAdded(isAdded);
    }
  }, [cartarray]);

  const handleBuyNow = (e) => {
    e.preventDefault();

    if (!isLoggedIn) return alert("Please sign in first");

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

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) return alert("Please sign in first");

    const body = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      description:product.description.split(" ").slice(0,20).join(" ") + "....."
    };

    try {
      const res = await addToCart(body);
      if (!Array.isArray(res)) return alert("Failed to add item");

      setCartArray(res);
      setAdded(true);
      alert("Added to cart!");
    } catch {
      alert("Could not add item");
    }
  };

  return (
    <NavLink to={`/product/detail/${product._id}`} className={Styles.card}>
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className={Styles.image}
      />

      <div className={Styles.content}>
        <h2 className={Styles.title}>{product.name}</h2>

        <p className={Styles.description}>{product.description}</p>

        <div className={Styles.price}>₹ {product.price}</div>

        <div className={Styles.btnRow}>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`${Styles.btn} ${
              added ? Styles.addedDisabled : Styles.addDefault
            }`}
          >
            {added ? "Added ✓" : "+ Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            className={`${Styles.btn} ${Styles.buyNow}`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </NavLink>
  );
}

export default ProductCard;
