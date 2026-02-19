"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CONST_TEXT } from "@/utils/const-text";

export default function TaskCreatePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [assignee, setAssignee] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  // 未認証時はリダイレクト
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return <div>{CONST_TEXT.LOADING}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          assignee,
          memo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || CONST_TEXT.TASK_CREATE_FAILED);
        return;
      }

      router.push("/tasks");
    } catch (err) {
      console.error("Error creating task:", err);
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
        {CONST_TEXT.CREATE_TASK}
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
          type="text"
          placeholder={CONST_TEXT.TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        <input
          type="text"
          placeholder={CONST_TEXT.CATEGORY}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        <input
          type="text"
          placeholder={CONST_TEXT.ASSIGNEE}
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
          }}
        />
        <textarea
          placeholder={CONST_TEXT.MEMO}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
            minHeight: "80px",
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
          {isLoading ? CONST_TEXT.LOADING : CONST_TEXT.CREATE}
        </button>
      </form>
      <Link
        href="/tasks"
        style={{ marginTop: "2rem", color: "#6366f1", fontWeight: "bold" }}
      >
        {CONST_TEXT.BACK_TO_LIST}
      </Link>
    </main>
  );
}
