"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { CONST_TEXT } from "@/utils/const-text";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ユーザー登録 API を呼び出し
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || CONST_TEXT.REGISTER_FAILED);
        return;
      }

      // 登録成功後、自動ログイン
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/tasks");
      } else {
        // 登録は成功したが自動ログイン失敗の場合
        router.push("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(CONST_TEXT.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
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
        {CONST_TEXT.REGISTER}
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
          type="text"
          placeholder={CONST_TEXT.NAME}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
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
          autoComplete="new-password"
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
          placeholder={CONST_TEXT.PASSWORD_CONFIRM}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: "0" }}>
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
          {isLoading ? CONST_TEXT.REGISTERING : CONST_TEXT.REGISTER_BUTTON}
        </button>
      </form>
      <p style={{ marginTop: "1.5rem", color: "#666" }}>
        {CONST_TEXT.ALREADY_HAVE_ACCOUNT}
        <Link
          href="/login"
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
