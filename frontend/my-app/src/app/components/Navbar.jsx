'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState(0);


  const handleLogout = () => {
    setLoggedIn(false)
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
  };


  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || '';

    const storedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    console.log(storedCart);


    const totalQty = storedCart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    setCart(totalQty);

  };


  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loggedIn")) || '';
    const user = JSON.parse(localStorage.getItem("currentUser")) || '';

    console.log("user", user);

    if (login) {
      setLoggedIn(true);
      setUsername(user.name)
    }
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);

    return () => window.removeEventListener('cart-updated', updateCartCount);

  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Pastel Boutique</div>
      <div className="nav-left">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/products" className="nav-link">Shop</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-right">
        {!loggedIn ? (
          <>
            <Link href="/login" className="nav-link" >Login</Link>
            <Link href="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link href="/account" className="nav-link">{username}</Link>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        )}
        <Link href="/cart" className="nav-link">Cart ({cart})</Link>
      </div>
    </nav>
  );
}
