"use client";
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { toggleCompleted } from "../../store/tasksSlice";

export default function TasksPage() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<"all" | "completed" | "incomplete">("all");

  const filteredTasks =
    tab === "all"
      ? tasks
      : tab === "completed"
      ? tasks.filter((t) => t.completed)
      : tasks.filter((t) => !t.completed);

  return (
    <main
      style={{
        minHeight: "90vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "#6366f1", marginBottom: "1rem" }}>
        タスク一覧
      </h2>
      <Link href="/tasks/create">
        <button
          style={{
            padding: "0.5rem 1.5rem",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "2rem",
          }}
        >
          タスク作成
        </button>
      </Link>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "500px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setTab("all")}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: tab === "all" ? "#6366f1" : "#e0e7ff",
            color: tab === "all" ? "#fff" : "#6366f1",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow:
              tab === "all" ? "0 2px 8px rgba(99,102,241,0.10)" : "none",
            transition: "all 0.2s",
          }}
        >
          すべて
        </button>
        <button
          onClick={() => setTab("incomplete")}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: tab === "incomplete" ? "#f59e42" : "#e0e7ff",
            color: tab === "incomplete" ? "#fff" : "#f59e42",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow:
              tab === "incomplete" ? "0 2px 8px rgba(245,158,66,0.10)" : "none",
            transition: "all 0.2s",
          }}
        >
          未完
        </button>
        <button
          onClick={() => setTab("completed")}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: tab === "completed" ? "#10b981" : "#e0e7ff",
            color: tab === "completed" ? "#fff" : "#10b981",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow:
              tab === "completed" ? "0 2px 8px rgba(16,185,129,0.10)" : "none",
            transition: "all 0.2s",
          }}
        >
          完了
        </button>
      </div>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        {filteredTasks.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              color: "#6366f1",
              boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
            }}
          >
            タスクがありません
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1.2rem 1rem",
                marginBottom: "1.2rem",
                boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.35em 1em",
                  borderRadius: "999px",
                  background: task.completed ? "#10b981" : "#f59e42",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  minWidth: "70px",
                  textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  transition: "background 0.2s",
                }}
              >
                {task.completed ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ marginRight: 4 }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#10b981" />
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    完了
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ marginRight: 4 }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#f59e42" />
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.3"
                      />
                    </svg>
                    未完
                  </>
                )}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.15rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  <Link
                    href={`/tasks/${task.id}`}
                    style={{ color: "#6366f1", textDecoration: "none" }}
                  >
                    {task.title}
                  </Link>
                </div>
                <div
                  style={{
                    color: "#6366f1",
                    fontSize: "0.95rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  カテゴリー: {task.category}
                </div>
                <div style={{ fontSize: "0.95rem", color: "#374151" }}>
                  担当者: {task.assignee}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  onClick={() => dispatch(toggleCompleted(task.id))}
                  style={{
                    padding: "0.45em 1em",
                    borderRadius: "8px",
                    border: "none",
                    background: task.completed ? "#f59e42" : "#10b981",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    transition: "background 0.2s",
                    minWidth: "100px",
                  }}
                >
                  {task.completed ? "未完にする" : "完了にする"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
