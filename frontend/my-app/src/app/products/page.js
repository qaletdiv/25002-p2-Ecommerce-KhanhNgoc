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
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${currentPage}&limit=${itemsPerPage}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-");
      if (min) url += `&minPrice=${min}`;
      if (max) url += `&maxPrice=${max}`;
    }

    if (sort !== "default") {
      url += `&sort=${sort}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalPages(Math.ceil(data.total / data.limit));
      });
  }, [currentPage, category, priceRange, sort]);

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

    const existing = cart.find((item) => item.id === product.id);

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
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <ProductCard product={p} />
          </div>
        ))}
      </div>


      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}