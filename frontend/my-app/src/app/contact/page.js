"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./contact.css";

export default function ContactPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, subject, message } = form;

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const messages = JSON.parse(localStorage.getItem("messages")) || [];

    messages.push({
      name,
      email,
      subject,
      message,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("messages", JSON.stringify(messages));

    alert("Thank you! Your message has been submitted.");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const goCart = () => {
    router.push("/cart");
  };

  return (
    <main className="contact-container">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? Send us a message!</p>

      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Subject:</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <label>Message:</label>
        <textarea
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <button onClick={goCart} style={{ marginTop: 20 }}>
        Cart
      </button>
    </main>
  );
}