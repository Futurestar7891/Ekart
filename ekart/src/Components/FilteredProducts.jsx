import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../Context/appContext";
import ProductCard from "../Components/ProductCard";

function FilteredProducts() {
  const { filteredProducts, activeCategory, categoryFilters } =
    useContext(AppContext);

  // Local state only (no cache)
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ------------ RESET FILTERS WHEN CATEGORY CHANGES ------------ */
  useEffect(() => {
    setActiveFilters({});
    setSortOption("");
  }, [activeCategory]);

  /* ------------ GET POSSIBLE FILTERS FOR CATEGORY ------------ */
  const categoryFilterSet =
    categoryFilters.find((c) => c.category === activeCategory)?.filters || {};

  /* ------------ TOGGLE FILTER ------------ */
  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [key]: updated };
    });
  };

  /* ------------ APPLY FILTERS & SORT ------------ */
  const applyFilters = () => {
    let result = [...filteredProducts];

    // Attribute filters
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((p) =>
          values.includes(String(p.attributes?.[key]))
        );
      }
    });

    // Sorting
    if (sortOption === "priceLow") result.sort((a, b) => a.price - b.price);
    if (sortOption === "priceHigh") result.sort((a, b) => b.price - a.price);
    if (sortOption === "ratingLow") result.sort((a, b) => a.rating - b.rating);
    if (sortOption === "ratingHigh") result.sort((a, b) => b.rating - a.rating);

    return result;
  };

  const finalList = applyFilters();

  return (
    <div style={{ display: "flex", marginTop: "140px", padding: "20px" }}>
      {/* SIDEBAR */}
      {sidebarOpen && (
        <div
          style={{
            width: "260px",
            background: "#f8f8f8",
            padding: "18px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "sticky",
            top: "120px",
            height: "calc(100vh - 140px)",
            overflowY: "auto",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            Filters
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✖
            </button>
          </h3>

          {Object.entries(categoryFilterSet).map(([key, values]) => (
            <div key={key} style={{ marginBottom: "20px" }}>
              <strong style={{ fontSize: "14px" }}>{key}</strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: "6px",
                  marginTop: "6px",
                }}
              >
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
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: "20px", marginTop:"10px" }}>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              marginBottom: "20px",
              padding: "6px 12px",
              fontSize: "14px",
              borderRadius: "6px",
            }}
          >
            Show Filters
          </button>
        )}

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        >
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="ratingLow">Rating: Low to High</option>
          <option value="ratingHigh">Rating: High to Low</option>
        </select>

        {finalList.length === 0 ? (
          <h2>No products found</h2>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
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
