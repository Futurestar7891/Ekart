import React, { useEffect, useState, useContext } from "react";
import Styles from "../Modules/FilteredProducts.module.css";
import { AppContext } from "../Context/appContext";
import ProductCard from "../Components/ProductCard";

function FilteredProducts() {
  const { filteredProducts, activeCategory, categoryFilters } =
    useContext(AppContext);

  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveFilters({});
    setSortOption("");
  }, [activeCategory]);

  const categoryFilterSet =
    categoryFilters.find((c) => c.category === activeCategory)?.filters || {};

  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [key]: updated };
    });
  };

  const applyFilters = () => {
    let result = [...filteredProducts];

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((p) =>
          values.includes(String(p.attributes?.[key]))
        );
      }
    });

    if (sortOption === "priceLow") result.sort((a, b) => a.price - b.price);
    if (sortOption === "priceHigh") result.sort((a, b) => b.price - a.price);
    if (sortOption === "ratingLow") result.sort((a, b) => a.rating - b.rating);
    if (sortOption === "ratingHigh") result.sort((a, b) => b.rating - a.rating);

    return result;
  };

  const finalList = applyFilters();

  return (
    <div className={Styles.wrapper}>
      {/* LEFT DESKTOP SIDEBAR */}
      <div className={Styles.sidebar}>
        <h3 className={Styles.filterTitle}>Filters</h3>

        {Object.entries(categoryFilterSet).map(([key, values]) => (
          <div key={key} className={Styles.filterGroup}>
            <strong className={Styles.filterLabel}>{key}</strong>

            <div className={Styles.filterOptions}>
              {values.map((val) => (
                <label key={val}>
                  <input
                    type="checkbox"
                    checked={activeFilters[key]?.includes(val) || false}
                    onChange={() => toggleFilter(key, val)}
                  />{" "}
                  {val}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE FULL SCREEN FILTERS */}
      {sidebarOpen && (
        <div className={Styles.sidebarMobile}>
          <div className={Styles.sidebarHeader}>
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>

          {Object.entries(categoryFilterSet).map(([key, values]) => (
            <div key={key} className={Styles.filterGroup}>
              <strong className={Styles.filterLabel}>{key}</strong>
              <div className={Styles.filterOptions}>
                {values.map((val) => (
                  <label key={val}>
                    <input
                      type="checkbox"
                      checked={activeFilters[key]?.includes(val) || false}
                      onChange={() => toggleFilter(key, val)}
                    />{" "}
                    {val}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            className={Styles.applyBtn}
            onClick={() => setSidebarOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* RIGHT CONTENT */}
      <div className={Styles.main}>
        {/* MOBILE sticky filters + sort */}
        <div className={Styles.mobileTopRow}>
          <button
            className={Styles.showFilterBtn}
            onClick={() => setSidebarOpen(true)}
          >
            Show Filters
          </button>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={Styles.sortSelectMobile}
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="ratingLow">Rating: Low to High</option>
            <option value="ratingHigh">Rating: High to Low</option>
          </select>
        </div>

        {/* DESKTOP sticky sort */}
        <div className={Styles.sortWrapper}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={Styles.sortSelectDesktop}
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="ratingLow">Rating: Low to High</option>
            <option value="ratingHigh">Rating: High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {finalList.length === 0 ? (
          <h2>No products found</h2>
        ) : (
          <div className={Styles.productGrid}>
            {finalList.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilteredProducts;
