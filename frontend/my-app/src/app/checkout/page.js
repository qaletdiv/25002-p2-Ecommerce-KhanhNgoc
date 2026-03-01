'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./checkout.css";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState({
    fullname: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please login before checkout.");
      router.push("/login");
      return;
    }

    async function fetchCart() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user.id}`);
        const data = await res.json();
        setCart(data.items || []);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [router]);

  useEffect(() => {
    let sum = 0;
    cart.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod) sum += prod.price * item.quantity;
    });
    setTotal(sum);
  }, [cart, products]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.id);
      return {
        id: item.id,
        name: prod?.name || "Unknown Product",
        price: prod?.price || 0,
        qty: item.quantity,
      };
    });

    const order = {
      orderId: "ORD" + Date.now(),
      userEmail: user.email,
      items: orderItems,
      total: orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
      ...shipping,
      date: new Date().toISOString(),
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

  
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user.id}/clear`, { method: "POST" });

      localStorage.removeItem(`cart_${user.id}`);
      localStorage.setItem("recentOrder", JSON.stringify(order));

      router.push("/confirm");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    }
  };

  if (loading) return <p>Loading checkout...</p>;
  if (cart.length === 0) return <p>Your cart is empty. <button onClick={() => router.push("/cart")}>Go to Cart</button></p>;

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-wrapper">
        <section className="shipping-box">
          <h2>Shipping Information</h2>

          <form id="shipping-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" id="fullname" value={shipping.fullname} onChange={handleChange} required />

            <label>Phone Number</label>
            <input type="text" id="phone" value={shipping.phone} onChange={handleChange} required />

            <label>Address</label>
            <textarea id="address" value={shipping.address} onChange={handleChange} required></textarea>

            <button className="btn confirm-btn" type="submit">Confirm Order</button>
          </form>
        </section>

        <section className="summary-box">
          <h2>Order Summary</h2>
          <div id="summary-items">
            {cart.map((item) => {
              const prod = products.find((p) => p.id === item.id);
              if (!prod) return null;
              return (
                <div className="summary-item" key={item.id}>
                  <span>{prod.name} (x{item.quantity})</span>
                  <span>${(prod.price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-total">
            <p>Total:</p>
            <h3 id="summary-total">${total.toLocaleString()}</h3>
          </div>
        </section>
      </div>
    </main>
  );
}