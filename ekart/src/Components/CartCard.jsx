import { FaTrash } from "react-icons/fa";
import Styles from "../Modules/CartCard.module.css";

function CartCard({ item, onQuantityChange, onDelete }) {
  return (
    <div className={Styles.card}>
      {/* IMAGE */}
      <img src={item.image} alt={item.name} className={Styles.image} />

      {/* TEXT */}
      <div className={Styles.details}>
        <h3 className={Styles.name}>{item.name}</h3>
        <p className={Styles.desc}>{item.description}</p>
      </div>

      {/* RIGHT BOX (FIXED) */}
      <div className={Styles.rightBox}>
        <p className={Styles.price}>₹{item.price.toFixed(2)}</p>

        <select
          className={Styles.select}
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

        <FaTrash
          onClick={() => onDelete(item.productId)}
          className={Styles.trash}
          title="Delete Item"
        />
      </div>
    </div>
  );
}

export default CartCard;
