// src/components/CategoryListing.jsx
import React, { useContext, useEffect, useRef } from "react";
import styles from "../Modules/CategoryListing.module.css";
import { AppContext } from "../Context/appContext";
import Shimmer from "../Shimmer";

const CategoryListing = () => {
  const {
    categoriesLoading,
    categories,
    activeCategory,
    setActiveCategory,
    products,
    setFilteredProducts,
  } = useContext(AppContext);

  const activeRef = useRef(null); // NEW: reference to active category

  const filterCategory = (cat) => {
    const category = cat.trim();
    setActiveCategory(category);

    if (category === "All") {
      return setFilteredProducts(products);
    }

    setFilteredProducts(
      products.filter((p) => p.category?.trim() === category)
    );
  };

  // AUTO-SCROLL ACTIVE CATEGORY INTO CENTER
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategory, categoriesLoading]);

  return (
    <div className={styles.categoryBar}>
      <ul className={styles.categoryList}>
        {categoriesLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className={styles.categoryItem}>
                <Shimmer height="25px" width="60px" />
              </li>
            ))
          : categories.map((cat, idx) => (
              <li
                key={idx}
                className={styles.categoryItem}
                ref={activeCategory === cat.trim() ? activeRef : null} // attach ref to active item
              >
                <span
                  onClick={() => filterCategory(cat)}
                  className={
                    activeCategory === cat.trim()
                      ? styles.categoryActive
                      : styles.categoryLink
                  }
                >
                  {cat}
                </span>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default CategoryListing;
