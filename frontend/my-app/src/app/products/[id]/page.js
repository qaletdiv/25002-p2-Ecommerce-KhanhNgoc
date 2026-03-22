'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "./product-detail.css";

export default function ProductDetailPage() {
  const { id } = useParams();  
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);

       
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?category=${data.category}`);
        const allData = await allRes.json();
        setRelated(
          allData.products
            .filter(p => p.id !== data.id)
            .slice(0, 4)
        );;
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    const qty = parseInt(document.getElementById("quantity").value || 1);
    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += qty;
    else cart.push({ id: product.id, quantity: qty });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert("Added to cart!");
  };

  if (!product) return <p className="loading">Loading product...</p>;

  return (
    <main className="detail-container">
      <section className="product-detail">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>

          <div className="quantity-select">
            <label htmlFor="quantity">Quantity:</label>
            <input type="number" id="quantity" min="1" defaultValue={1} />
          </div>

          <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </section>

      <section className="related-section">
        <h3>Related Products</h3>
        <div className="related-list">
          {related.length === 0 && <p>No related products found.</p>}
          {related.map(r => (
            <div key={r.id} className="related-item" onClick={() => router.push(`/products/${r.id}`)}>
              <img src={r.image} alt={r.name} />
              <h4>{r.name}</h4>
              <p className="price">${r.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}