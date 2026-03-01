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



  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);



  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange, sort]);




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




  const itemsPerPage = 6;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

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
          <option value="50-100">$50 -$100</option>
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
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)}>1</button>
        <button onClick={() => setCurrentPage(2)}>2</button>
      </div>
    </div>
  );
}