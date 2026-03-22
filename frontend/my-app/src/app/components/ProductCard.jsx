'use client';

import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/products/${product.id}`);
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

      <p className="price">${product.price.toFixed(2)}</p>
      <button className="btn" onClick={handleView}>
        View
      </button>
    </div>
  );
}