import { FaTrash } from "react-icons/fa";

function CartCard({ item, onQuantityChange, onDelete }) {
  return (
    <div style={styles.card}>
      {/* IMAGE */}
      <img src={item.image} alt={item.name} style={styles.image} />

      {/* NAME + DESCRIPTION */}
      <div style={styles.details}>
        <h3 style={styles.name}>{item.name}</h3>
        <p style={styles.description}>{item.description}</p>
      </div>

      {/* PRICE */}
      <p style={styles.price}>₹{item.price.toFixed(2)}</p>

      {/* QUANTITY DROPDOWN */}
      <select
        style={styles.select}
        value={item.quantity}
        onChange={(e) =>
          onQuantityChange(item.productId, parseInt(e.target.value))
        }
      >
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            Qty: {i + 1}
          </option>
        ))}
      </select>

      {/* DELETE BUTTON */}
      <FaTrash
        onClick={() => onDelete(item.productId)}
        style={styles.trashIcon}
        title="Delete Item"
      />
    </div>
  );
}

export default CartCard;

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "14px",
    gap: "20px",
    width: "100%",
    background: "#fff",
  },

  image: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  details: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  name: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: 0,
  },

  description: {
    fontSize: "0.9rem",
    color: "#666",
    marginTop: "4px",
  },

  price: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    minWidth: "90px",
    textAlign: "right",
  },

  select: {
    padding: "6px 10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #999",
  },

  trashIcon: {
    color: "red",
    cursor: "pointer",
    fontSize: "1.4rem",
    marginLeft: "10px",
  },
};
