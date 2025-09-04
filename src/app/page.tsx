import Link from "next/link";

export default function Home() {
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
      <Link href="/login">
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ログイン
        </button>
      </Link>
      <Link href="/tasks">
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            background: "#f59e42",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          タスク一覧へ
        </button>
      </Link>
    </main>
  );
}
