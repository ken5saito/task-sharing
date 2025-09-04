"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        background: "rgba(99,102,241,0.95)",
        boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
        zIndex: 100,
        padding: "0.8rem 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1
          style={{
            color: "#fff",
            fontSize: "1.7rem",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            margin: 0,
            textShadow: "0 2px 8px rgba(99,102,241,0.15)",
            userSelect: "none",
          }}
        >
          Task Sharing
        </h1>
      </Link>
    </header>
  );
}
