"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./cart.css";

export default function CartPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  const productMap = useMemo(() => {
    return Object.fromEntries(products.map(p => [p.id, p]));
  }, [products]);
  const updateQty = (id, qty) => {
    const updated = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Number(qty)) }
        : item
    );

    setCart(updated);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
  };


  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);

    setCart(updated);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
  };





  const total = cart.reduce((sum, item) => {
    const product = productMap[item.id];
    if (!product) return sum;

    return sum + product.price * (item.quantity || 1);
  }, 0);

  if (loading) return <p>Loading cart...</p>;

  return (
    <main className="cart-container">
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map(item => {
              const product = productMap[item.id];

              if (!product) {
                return (
                  <p key={item.id}>
                    Product not found (ID: {item.id})
                  </p>
                );
              }

              const qty = item.quantity || 1;
              const subtotal = product.price * qty;

              return (
                <div key={item.id} className="cart-item">
                  <img src={product.image} alt={product.name} />

                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price}</p>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) =>
                      updateQty(item.id, e.target.value)
                    }
                  />

                  <button onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <p>Total: ${total.toFixed(2)}</p>

            <button id="checkout-btn" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}