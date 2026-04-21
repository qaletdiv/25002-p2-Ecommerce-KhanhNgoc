"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./confirm.css"; 

export default function Page() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lastOrder"));

    if (!stored) {
      router.push("/products");
      return;
    }

    setOrder(stored);
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <main className="confirm-container">
      <div className="confirm-card">
        <h1> Order Successful!</h1>

        <div className="order-summary">
          <h3>Shipping Info</h3>
          <p><b>Name:</b> {order.fullname}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.address}</p>
        </div>

        <div className="order-summary">
          <h3>Items</h3>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} (x{item.qty}) - ${item.price}
            </p>
          ))}
        </div>

        <div className="order-summary">
          <h3>Total</h3>
          <p><b>${order.total}</b></p>
        </div>

        <button
          className="btn"
          onClick={() => router.push("/products")}
        >
          Back to Shop
        </button>
        <button
          className="btn"
         onClick={() => router.push("/account")}
        >
           View Order History
          </button>
      </div>
    </main>
  );
}