import React, { useState, useEffect } from "react";

const Suggestionbox = ({
  query,
  products,
  setSearchText,
  setActiveCategory,
}) => {
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

    setMatches(result.slice(0, 8));
  }, [query, products]);

  const onSelect = (category) => {
    setActiveCategory(category);
    setMatches([]);
    setSearchText("");
  };

  if (!query || matches.length === 0) return null;

  return (
    <ul
      className="
        absolute md:top-[70px] md:w-full
        md:left-0
        max-h-[280px] overflow-y-auto
        bg-white border border-gray-300 rounded-lg shadow-lg
        no-scrollbar
        w-full
      "
    >
      {matches.map((p) => (
        <li
          key={p._id}
          onClick={() => onSelect(p.category)}
          className="cursor-pointer p-3 border-b border-gray-200 hover:bg-gray-100"
        >
          <strong>{p.name}</strong>
          <div className="text-xs text-gray-500">{p.brand || p.category}</div>
        </li>
      ))}
    </ul>
  );
};

export default Suggestionbox;
