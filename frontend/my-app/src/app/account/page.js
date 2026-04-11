"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./account.css";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));

    if (!u) {
      router.push("/login");
      return;
    }

    setUser(u);

    fetch(`http://localhost:4000/api/orders/${u.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading account...</p>;
  if (!user) return null;

  return (
    <main className="account-container">
      <h1>My Account</h1>

      <section className="personal-info">
        <h2>Personal Information</h2>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </section>

      <section className="order-history">
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td>Completed</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}