"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CONST_TEXT } from "@/utils/const-text";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(CONST_TEXT.LOGIN_FAILED);
    } else if (result?.ok) {
      router.push("/tasks");
    }
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
        noValidate
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
          autoComplete="email"
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
          autoComplete="current-password"
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        {error && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "0.875rem",
              margin: "0",
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "0.75rem",
            background: isLoading ? "#999" : "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? CONST_TEXT.LOGIN_LOADING : CONST_TEXT.LOGIN}
        </button>
      </form>
      <p style={{ marginTop: "1.5rem", color: "#666" }}>
        アカウントをお持ちですか？
        <Link
          href="/register"
          style={{
            color: "#6366f1",
            textDecoration: "none",
            fontWeight: "bold",
            marginLeft: "0.5rem",
          }}
        >
          {CONST_TEXT.LOGIN}
        </Link>
      </p>
    </main>
  );
}
