'use client';
import { useEffect, useState } from "react";

export default function ConfirmPage() {
  const [order, setOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return null;

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`http://localhost:4000/api/orders/${user.id}`);
      const orders = await res.json();
      setOrder(orders[orders.length - 1] || null);
    }
    fetchOrder();
  }, [user.id]);

  if (!order) return <p>No recent order found.</p>;

  return (
    <main>
      <h1>Order Confirmed!</h1>
      <p>Order ID: {order.id}</p>
      <p>Total: ${order.total}</p>
      <ul>
        {order.items.map(item => (
          <li key={item.productId}>{item.name} × {item.quantity}</li>
        ))}
      </ul>
    </main>
  );
}