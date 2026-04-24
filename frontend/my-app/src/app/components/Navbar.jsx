'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [cart, setCart] = useState(0);

  // xac nhan nguoi dung
  const syncAuth = () => {
    const login = localStorage.getItem("loggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};

    setLoggedIn(login);
    setUsername(user.name || "");
  };

  // cart 
  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${user?.id}`)) || [];
    const totalQty = storedCart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCart(totalQty);
  };

  useEffect(() => {
    syncAuth();
    updateCartCount();
    window.addEventListener("auth", syncAuth);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("auth", syncAuth);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    // Khi luu trong localstorage, phai bao cho nav( dung event) , vi ui chi dung state de thay doi du kien, ma ban dau useeffect chi mouun 1 lan 
    window.dispatchEvent(new Event("auth"));
  };

  return (
    <nav className="navbar">
      <div className="logo">Pastel Boutique</div>

      <div className="nav-left">
        <Link href="/">Home</Link>
        <Link href="/products">Shop</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className="nav-right">
        {!loggedIn ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/account">{username}</Link>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        <Link href="/cart">Cart ({cart})</Link>
      </div>
    </nav>
  );
}