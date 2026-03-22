'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    router.push("/account/login");
    return null;
  }
  
  useEffect(() => {
    async function fetchData() {
      try {
        const resCart = await fetch(`http://localhost:4000/api/cart/${user.id}`);
        const cartData = await resCart.json();
        setCart(cartData.items);

        const resProducts = await fetch(`http://localhost:4000/api/products`);
        const prodData = await resProducts.json();
        setProducts(prodData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  const handleQtyChange = async (productId, quantity) => {
    await fetch(`http://localhost:4000/api/cart/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemove = async (productId) => {
    await fetch(`http://localhost:4000/api/cart/${user.id}/${productId}`, {
      method: "DELETE",
    });
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return prod ? sum + prod.price * item.quantity : sum;
  }, 0);

  if (loading) return <p>Loading cart...</p>;

  return (
    <main>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            if (!prod) return null;
            return (
              <div key={item.productId}>
                <h3>{prod.name}</h3>
                <p>Price: ${prod.price}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(item.productId, parseInt(e.target.value))}
                />
                <button onClick={() => handleRemove(item.productId)}>Remove</button>
              </div>
            );
          })}
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={() => router.push("/checkout")}>Checkout</button>
        </div>
      )}
    </main>
  );
}