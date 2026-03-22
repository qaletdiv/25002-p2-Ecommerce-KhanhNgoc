'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [shipping, setShipping] = useState({ fullname: "", phone: "", address: "" });

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    router.push("/account/login");
    return null;
  }

  useEffect(() => {
    async function fetchData() {
      const resCart = await fetch(`http://localhost:4000/api/cart/${user.id}`);
      const data = await resCart.json();
      setCart(data.items);

      const resProducts = await fetch("http://localhost:4000/api/products");
      const prodData = await resProducts.json();
      setProducts(prodData.products || []);
    }
    fetchData();
  }, [user.id]);

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:4000/api/orders/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: shipping }),
      });
      router.push("/confirm");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  const total = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return prod ? sum + prod.price * item.quantity : sum;
  }, 0);

  if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <main>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input name="fullname" placeholder="Full Name" value={shipping.fullname} onChange={handleChange} required/>
        <input name="phone" placeholder="Phone" value={shipping.phone} onChange={handleChange} required/>
        <textarea name="address" placeholder="Address" value={shipping.address} onChange={handleChange} required/>
        <p>Total: ${total.toFixed(2)}</p>
        <button type="submit">Place Order</button>
      </form>
    </main>
  );
}