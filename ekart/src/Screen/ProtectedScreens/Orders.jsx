import React, { useEffect, useContext } from "react";
import { AppContext } from "../../Context/appContext";

function Orders() {
  const { orders, setOrders, isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/orders/my-orders", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Error loading orders:", err);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <div>
                <strong>Order ID:</strong> {order.orderId}
                <p style={styles.date}>
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span style={styles.status}>{order.orderStatus}</span>
            </div>

            {/* Items (Horizontal full width) */}
            <div style={styles.itemsWrapper}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <img src={item.image} style={styles.itemImage} alt="" />
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemQty}>Qty: {item.quantity}</p>
                  <p style={styles.itemPrice}>
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={styles.total}>Total Amount: ₹ {order.totalAmount}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;

/* ------------------------ STYLING ------------------------ */

const styles = {
  container: {
    padding: "20px",
    width: "100vw",
    // border:"2px solid red"
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  empty: {
    fontSize: "18px",
    color: "gray",
  },

  /* Card takes full width */
  card: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "25px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },

  status: {
    padding: "6px 12px",
    background: "#d4f7d6",
    color: "#1d7c2c",
    borderRadius: "6px",
    fontWeight: "600",
    height: "fit-content",
  },

  date: {
    color: "#777",
    fontSize: "14px",
  },

  /* FULL WIDTH + HORIZONTAL SCROLL */
  itemsWrapper: {
    display: "flex",
    width: "100%",
    gap: "20px",
    overflowX: "auto",
    padding: "10px 0",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },

  item: {
    minWidth: "180px",
    padding: "12px",
    borderRadius: "10px",
    background: "#fafafa",
    border: "1px solid #ddd",
    textAlign: "center",
  },

  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    marginBottom: "10px",
  },

  itemName: {
    fontWeight: "600",
    fontSize: "14px",
  },

  itemQty: {
    fontSize: "13px",
    color: "#555",
  },

  itemPrice: {
    fontWeight: "bold",
    marginTop: "5px",
  },

  total: {
    textAlign: "right",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
