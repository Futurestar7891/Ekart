const API = import.meta.env.API;
const BASE_URL = `${API}/cart`;

// GET CART
export const fetchCart = async () => {
  const res = await fetch(`${BASE_URL}`, { credentials: "include" });
  const data = await res.json();
  return data || [];
};

// ADD TO CART
export const addToCart = async (product) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return await res.json();
};

// UPDATE QTY
export const updateQuantity = async (productId, quantity) => {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  return await res.json();
};

// DELETE ITEM
export const deleteCartItem = async (productId) => {
  const res = await fetch(`${BASE_URL}/delete`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  return await res.json();
};
