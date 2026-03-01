"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId"); // ví dụ URL: /confirm?orderId=123

  useEffect(() => {
    if (!orderId) {
      alert("No order specified!");
      router.push("/shop");
      return;
    }

    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then(data => {
        setOrder(data);
      })
      .catch(err => {
        console.error(err);
        alert("Order not found");
        router.push("/shop");
      })
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  if (!order)
    return <p className="p-10 text-center text-red-500">Order not found.</p>;

  return (
    <main className="flex justify-center p-10">
      <div className="bg-pink-50 p-10 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-pink-600 text-2xl font-bold mb-4">
          Thank You For Your Purchase! 💖
        </h1>
        <p className="mb-4">Your order has been successfully placed.</p>

        <div className="text-left bg-white p-5 rounded-lg shadow mb-5">
          <h3 className="text-gray-700 font-semibold mb-2">Order Summary</h3>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
          <hr className="my-2" />
          {order.items.map((item) => (
            <p key={item.id}>
              • {item.name} × {item.quantity} — $
              {(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
        </div>

        <button
          className="bg-pink-300 text-white py-2 px-5 rounded-full font-medium hover:bg-pink-400 transition"
          onClick={() => router.push("/shop")}
        >
          Back to Shop
        </button>
      </div>
    </main>
  );
}