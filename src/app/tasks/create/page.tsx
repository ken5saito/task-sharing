"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addTask } from "../../../store/tasksSlice";
import { useRouter } from "next/navigation";

export default function TaskCreatePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [assignee, setAssignee] = useState("");
  const [memo, setMemo] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addTask({
        title,
        category,
        assignee,
        memo,
        completed: false,
      })
    );
    router.push("/tasks");
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
        タスク作成
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
          placeholder="タイトル"
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
          placeholder="カテゴリー"
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
          placeholder="担当者"
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
          placeholder="メモ"
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
          作成
        </button>
      </form>
      <Link
        href="/tasks"
        style={{ marginTop: "2rem", color: "#6366f1", fontWeight: "bold" }}
      >
        一覧に戻る
      </Link>
    </main>
  );
}
