"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async (keyword = "") => {
    let url = "http://localhost:4000/api/products";

    if (keyword) {
      url += `?search=${keyword}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    setProducts(data.products.slice(0, 6));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(search);
  };

  return (
    <div>
      <section className="hero">
        <h1>Welcome to Pastel Boutique</h1>
        <p>Discover your favorite styles in soft pastel tones 🌸</p>
      </section>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>
    </div>
  );
}