"use client";
import { useState } from "react";
import { CONST_TEXT } from "@/utils/const-text";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${CONST_TEXT.LOGIN}: ${email}`);
  };

  return (
    <main
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "#6366f1", marginBottom: "1rem" }}>
        {CONST_TEXT.LOGIN}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "300px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(99,102,241,0.1)",
        }}
      >
        <input
          type="email"
          placeholder={CONST_TEXT.EMAIL}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        <input
          type="password"
          placeholder={CONST_TEXT.PASSWORD}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {CONST_TEXT.LOGIN}
        </button>
      </form>
    </main>
  );
}
