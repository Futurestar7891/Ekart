import { FaTrash } from "react-icons/fa";

function CartCard({ item, onQuantityChange, onDelete }) {
  return (
    <div style={styles.card}>
      <img src={item.image} alt={item.name} style={styles.image} />

      <div style={styles.details}>
        <h3 style={styles.name}>{item.name}</h3>
        <p style={styles.description}>{item.description}</p>
      </div>

      <div style={styles.rightSection}>
        <p style={styles.price}>₹{item.price.toFixed(2)}</p>

        <select
          style={styles.select}
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Qty: {i + 1}
            </option>
          ))}
        </select>

        <FaTrash
          onClick={() => onDelete(item.id)}
          style={{ color: "red", cursor: "pointer", fontSize: "1.5vw" }}
          title="Delete Item"
        />
      </div>
    </div>
  );
}

export default CartCard;

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    border: "0.1vw solid #ccc",
    borderRadius: "1vw",
    padding: "1vw",
    gap: "2vw",
    justifyContent: "space-between",
  },
  image: {
    width: "10vw",
    height: "10vw",
    objectFit: "cover",
    borderRadius: "1vw",
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: "1.2vw",
    margin: "0 0 1vh 0",
  },
  description: {
    fontSize: "1vw",
    color: "#666",
  },
  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "1vh",
  },
  price: {
    fontSize: "1.2vw",
    fontWeight: "bold",
  },
  select: {
    padding: "0.5vh 1vw",
    fontSize: "1vw",
    borderRadius: "0.5vw",
    border: "0.1vw solid #999",
  },
};
