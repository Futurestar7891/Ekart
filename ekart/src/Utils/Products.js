const API = import.meta.env.API;
export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API}/products`, {
      method: "GET",
    });

    const data = await res.json();

    return data.products || [];
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};

export const fetchFilters = async () => {
  try {
    const res = await fetch(`${API}/products/filters`, {
      method: "GET",
    });

    const data = await res.json();

    return data.filters || [];
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};
export const addReview = async (productId, rating, comment, image) => {
  try {
    const res = await fetch(`${API}/products/${productId}/review`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, comment, image }),
    });

    const data = await res.json();

    if (!res.ok) return null;

    return data.products; // return full updated product list
  } catch (err) {
    console.error("Error adding review:", err);
    return null;
  }
};
