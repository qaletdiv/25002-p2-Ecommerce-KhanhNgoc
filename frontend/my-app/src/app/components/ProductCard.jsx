"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/products/${product.id}`);
  };

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      router.push("/login");
      return;
    }

    const key = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];

    const productId = Number(product.id);

    const existingIndex = cart.findIndex(
      item => Number(item.id) === productId
    );

    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        { id: productId, quantity: 1 }
      ];
    }

    localStorage.setItem(key, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));

    alert("Added to cart!");
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onClick={handleView}
        style={{ cursor: "pointer" }}
      />

      <h3 onClick={handleView} style={{ cursor: "pointer" }}>
        {product.name}
      </h3>

      <p className="price">
        ${Number(product.price).toFixed(2)}
      </p>

      <div className="actions">
        <button className="btn" onClick={handleView}>
          View
        </button>

        <button className="btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}