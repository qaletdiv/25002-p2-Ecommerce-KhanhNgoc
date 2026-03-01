'use client';
export default function ProductCard({ product, onAddToCart }) {
  const handleClick = () => {
    if (!onAddToCart) {
      alert("Please log in to add items to your cart.");
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <button className="btn" onClick={handleClick}>Added to cart</button>
    </div>
  );
}
