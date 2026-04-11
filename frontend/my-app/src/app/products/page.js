"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./shop.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange, sort]);

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      alert("Please login first");
      return;
    }

    const key = `cart_${user.id}`;

    let cart = JSON.parse(localStorage.getItem(key)) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        quantity: 1
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));

    alert("Added to cart!");
  };

 
  const filteredProducts = products
    .filter((p) => (category ? p.category === category : true))
    .filter((p) => {
      if (!priceRange) return true;
      const [min, max] = priceRange.split("-").map(Number);
      return p.price >= min && p.price <= max;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });


  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <div className="filters">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Dresses & Skirts">Dresses & Skirts</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </select>

        <select onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">All Price</option>
          <option value="0-50">Under $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-999">Above $100</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort By</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name-asc">Name A-Z</option>
        </select>
      </div>

    
      <div className="product-grid">
        {paginatedProducts.map((p) => (
          <div key={p.id} className="product-card">
            <ProductCard product={p} />

            
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}