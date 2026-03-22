'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      
      localStorage.setItem("currentUser", JSON.stringify(data));
      localStorage.setItem("loggedIn", "true");

      alert(`Welcome back, ${data.name}!`);
      router.push("/"); 
    } catch (err) {
      setErrorMsg(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
      <p>
        No account?{" "}
        <a
          href="/register"
          style={{
            backgroundColor: "#fcbaba",
            color: "white",
            padding: "10px 8px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Register
        </a>
      </p>
    </main>
  );
}