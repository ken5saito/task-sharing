import Link from "next/link";
import { CONST_TEXT } from "@/utils/const-text";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#6366f1",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          {CONST_TEXT.APP_NAME}
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#4b5563",
            marginBottom: "2rem",
            lineHeight: "1.8",
          }}
        >
          {CONST_TEXT.TAGLINE}
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(99,102,241,0.1)",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#6366f1",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            {CONST_TEXT.FEATURES_TITLE}
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
            }}
          >
            <li
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ color: "#10b981", fontSize: "1.2rem" }}>✓</span>
              <span style={{ color: "#374151" }}>{CONST_TEXT.FEATURE_1}</span>
            </li>
            <li
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ color: "#10b981", fontSize: "1.2rem" }}>✓</span>
              <span style={{ color: "#374151" }}>{CONST_TEXT.FEATURE_2}</span>
            </li>
            <li
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ color: "#10b981", fontSize: "1.2rem" }}>✓</span>
              <span style={{ color: "#374151" }}>{CONST_TEXT.FEATURE_3}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
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
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              transition: "background 0.2s",
            }}
          >
            {CONST_TEXT.LOGIN}
          </button>
        </Link>
        <Link href="/register">
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
              transition: "background 0.2s",
            }}
          >
            {CONST_TEXT.FREE_REGISTER}
          </button>
        </Link>
      </div>
    </main>
  );
}
