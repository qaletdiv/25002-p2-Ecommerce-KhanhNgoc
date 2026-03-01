'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./cart.css";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please log in to view your cart.");
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

  const handleQtyChange = async (id, qty) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });

      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user.id}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <main className="cart-container">
      <h1>Your Shopping Cart</h1>
      <div className="cart-list">
        {cart.length === 0 && <p>Your cart is empty.</p>}
        {cart.map((item) => {
          const prod = products.find((p) => p.id === item.id);
          if (!prod) return null;
          const subtotal = prod.price * item.quantity;
          return (
            <div className="cart-item" key={item.id}>
              <img src={prod.image} alt={prod.name} />
              <div className="cart-item-info">
                <h3>{prod.name}</h3>
                <p>Price: ${prod.price.toLocaleString()}</p>
                <p>
                  Subtotal: $<span>{subtotal.toLocaleString()}</span>
                </p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <p>Total: ${total.toLocaleString()}</p>
        <button
          id="checkout-btn"
          onClick={() => router.push("/checkout")}
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}