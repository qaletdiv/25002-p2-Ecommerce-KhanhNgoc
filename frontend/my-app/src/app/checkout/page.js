"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./checkout.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));

    if (!u) {
      router.push("/login");
      return;
    }

    setUser(u);

    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${u.id}`)) || [];

    setCart(storedCart);

    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  const getProduct = (id) =>
    products.find((p) => Number(p.id) === Number(id));

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    if (!product) return sum;
    return sum + product.price * (item.quantity || 1);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    const form = new FormData(e.target);

    const orderItems = cart.map((item) => {
      const product = getProduct(item.id);

      return {
        id: item.id,
        name: product?.name || "Unknown",
        price: product?.price || 0,
        qty: item.quantity || 1,
      };
    });

    const orderData = {
      userId: user.id,
      items: orderItems,
      total,
      fullname: form.get("fullname"),
      phone: form.get("phone"),
      address: form.get("address"),
      date: new Date().toLocaleDateString(),
    };

    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      localStorage.setItem("lastOrder", JSON.stringify(orderData));

  
      localStorage.removeItem(`cart_${user.id}`);

    
      router.push("/confirm");

    } catch (err) {
      console.error(err);
      alert("Order failed");
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading checkout...</p>;
  if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-wrapper">
        <section className="shipping-box">
          <h2>Shipping Information</h2>

          <form onSubmit={handleSubmit}>
            <input name="fullname" placeholder="Full Name" required />
            <input name="phone" placeholder="Phone Number" required />
            <textarea name="address" placeholder="Address" required />

            <button
              className="confirm-btn"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </form>
        </section>

        <section className="summary-box">
          <h2>Order Summary</h2>

          {cart.map((item) => {
            const product = getProduct(item.id);
            if (!product) return null;

            const qty = item.quantity || 1;

            return (
              <div key={item.id} className="summary-item">
                <span>{product.name} (x{qty})</span>
                <span>${(product.price * qty).toFixed(2)}</span>
              </div>
            );
          })}

          <div className="summary-total">
            <p>Total:</p>
            <h3>${total.toFixed(2)}</h3>
          </div>
        </section>
      </div>
    </main>
  );
}