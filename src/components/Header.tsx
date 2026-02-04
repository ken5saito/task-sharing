"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CONST_TEXT } from "@/utils/const-text";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        background: "rgba(99,102,241,0.95)",
        boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
        zIndex: 100,
        padding: "0.8rem 1rem",
        display: "flex",
        justifyContent: "space-between",
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
          {CONST_TEXT.APP_NAME}
        </h1>
      </Link>

      {session && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#fff", fontSize: "0.95rem" }}>
            {session.user?.email}
          </span>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            style={{
              padding: "0.5rem 1rem",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.background = "#dc2626";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.background = "#ef4444";
            }}
          >
            {CONST_TEXT.LOGOUT}
          </button>
        </div>
      )}
    </header>
  );
}
