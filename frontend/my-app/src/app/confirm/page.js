"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function ConfirmPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    const pending = JSON.parse(localStorage.getItem("pendingOrder"));

    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setOrder(pending);
    setLoading(false);
  }, []);


  const placeOrder = async () => {
    if (!order) {
      alert("No order found");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,        
          items: order.items,
          total: order.total,
        }),
      });

      const data = await res.json();

      console.log("RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem(`cart_${user.id}`);

      alert("Order placed successfully!");
      router.push("/products");

    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!order) return <p>No order found</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Confirm Order</h1>
      <h3>User: {user?.name}</h3>

      <hr />

      {order.items.map((item, i) => (
        <div key={i}>
          <p><b>{item.name}</b></p>
          <p>Qty: {item.qty}</p>
          <p>Price: ${item.price}</p>
          <hr />
        </div>
      ))}

      <h2>Total: ${order.total}</h2>

      <button
        onClick={placeOrder}
        style={{
          padding: "10px 20px",
          background: "#ff6b6b",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Place Order
      </button>
    </main>
  );
}