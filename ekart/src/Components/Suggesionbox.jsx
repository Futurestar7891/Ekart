import React, { useState, useEffect } from "react";

const Suggestionbox = ({ query, products,setSearchText,setActiveCategory }) => {
  const [matches, setMatches] = useState([]);
 

  useEffect(() => {
    if (!query) {
      setMatches([]);
      return;
    }

    const lower = query.toLowerCase();

    const result = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(lower);
      const descMatch = p.description?.toLowerCase().includes(lower);
      const brandMatch = p.brand?.toLowerCase().includes(lower);

      const attrMatch = Object.values(p.attributes || {}).some((v) =>
        String(v).toLowerCase().includes(lower)
      );

      return nameMatch || brandMatch || descMatch || attrMatch;
    });

    setMatches(result.slice(0, 8)); // show top 8
  }, [query, products]);

const onSelect = (category) => {
  setActiveCategory(category);
  setMatches([]);
  setSearchText("");
};


  if (!query || matches.length === 0) return null;

  return (
    <ul
      className="no-scrollbar"
      style={{
        position: "absolute",
        background: "white",
        top: "60px",
        left: 20,
        width: "500px",
        maxHeight: "280px",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "0",
        margin: "0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 999,
      }}
    >
      {matches.map((p) => (
        <li
          key={p._id}
          onClick={() => onSelect(p.category)}
          style={{
            listStyle: "none",
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          <strong>{p.name}</strong>
          <div style={{ fontSize: "12px", color: "#777" }}>
            {p.brand || p.category}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Suggestionbox;
