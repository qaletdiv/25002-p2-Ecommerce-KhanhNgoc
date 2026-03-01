'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => setLoggedIn(false);
  const handleLogin = () => setLoggedIn(true);

  return (
    <nav className="navbar">
      <div className="logo">Pastel Boutique</div>
      <div className="nav-left">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/products" className="nav-link">Shop</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-right">
        {!loggedIn? (
          <>
            <Link href="/login" className="nav-link" onClick={handleLogin}>Login</Link>
            <Link href="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link href="/account" className="nav-link">My Account</Link>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        )}
        <Link href="/cart" className="nav-link">Cart</Link>
      </div>
    </nav>
  );
}
