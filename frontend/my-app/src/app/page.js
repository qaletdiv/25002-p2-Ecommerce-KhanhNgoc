"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import "./home.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    const data = await res.json();
    setProducts(data.slice(0, 6));
    };
    
    fetchProducts();
    }, []);
  

  return (
    <div>
      <section className="hero">
        <h1>Welcome to Pastel Boutique</h1>
        <p>Discover your favorite styles in soft pastel tones 🌸</p>
      </section>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
