"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CONST_TEXT } from "@/utils/const-text";

interface Task {
  id: string;
  title: string;
  category: string;
  assignee: string;
  memo: string;
  completed: boolean;
  ownerId: string;
  createdBy: string;
  sharedWith: Record<string, boolean>;
  createdAt: number;
  updatedAt: number;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<"all" | "completed" | "incomplete">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{
    taskId: string;
    userId: string;
  } | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // useEffectを使用してセッション状態の変化に対応
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // タスク一覧を Firebase から取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompleted = async (taskId: string, completed: boolean) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !completed }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const shareTask = async (taskId: string) => {
    if (!shareEmail || !session?.user?.id) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareWithEmail: shareEmail }),
      });

      if (response.ok) {
        await fetchTasks();
        setShareModal(null);
        setShareEmail("");
        setNotification({
          type: "success",
          message: CONST_TEXT.SHARE_SUCCESS,
        });
        // 3秒後に通知を消す
        setTimeout(() => setNotification(null), 3000);
      } else {
        const errorData = await response.json();
        setNotification({
          type: "error",
          message: errorData.error || CONST_TEXT.SHARE_FAILED,
        });
      }
    } catch (error) {
      console.error("Failed to share task:", error);
      setNotification({
        type: "error",
        message: CONST_TEXT.NETWORK_ERROR,
      });
    }
  };

  // ローディング中
  if (status === "loading") {
    return (
      <main
        style={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#6366f1" }}>
          {CONST_TEXT.LOADING}
        </p>
      </main>
    );
  }

  // 認証中ではない場合は何も表示しない
  if (status !== "authenticated") {
    return null;
  }

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
      {/* 通知UI */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            background: notification.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {notification.message}
        </div>
      )}
      <h2 style={{ fontSize: "2rem", color: "#6366f1", marginBottom: "1rem" }}>
        {CONST_TEXT.TASK_LIST}
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
          {CONST_TEXT.CREATE_TASK}
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
          {CONST_TEXT.ALL}
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
          {CONST_TEXT.INCOMPLETE}
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
          {CONST_TEXT.COMPLETED}
        </button>
      </div>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        {isLoading ? (
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
            {CONST_TEXT.LOADING}
          </div>
        ) : filteredTasks.length === 0 ? (
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
            {CONST_TEXT.NO_TASKS}
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
                    {CONST_TEXT.COMPLETED}
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
                    {CONST_TEXT.INCOMPLETE}
                  </>
                )}
              </span>
              <div
                style={{
                  flex: 1,
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              >
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
                  {CONST_TEXT.CATEGORY}: {task.category}
                </div>
                <div style={{ fontSize: "0.95rem", color: "#374151" }}>
                  {CONST_TEXT.ASSIGNEE}: {task.assignee}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexDirection: "column",
                }}
              >
                <button
                  onClick={() => toggleTaskCompleted(task.id, task.completed)}
                  style={{
                    padding: "0.45em 0.8em",
                    borderRadius: "8px",
                    border: "none",
                    background: task.completed ? "#f59e42" : "#10b981",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {task.completed
                    ? CONST_TEXT.MARK_AS_INCOMPLETE
                    : CONST_TEXT.MARK_AS_COMPLETE}
                </button>
                {task.ownerId === session?.user?.id && (
                  <button
                    onClick={() =>
                      setShareModal({ taskId: task.id, userId: task.ownerId })
                    }
                    style={{
                      padding: "0.45em 0.8em",
                      borderRadius: "8px",
                      border: "none",
                      background: "#8b5cf6",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    共有
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 共有モーダル */}
      {shareModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShareModal(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#6366f1", marginTop: 0 }}>
              {CONST_TEXT.SHARE_TASK}
            </h3>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              {CONST_TEXT.ENTER_USER_ID}
            </p>
            <input
              type="text"
              placeholder={CONST_TEXT.USER_ID_PLACEHOLDER}
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShareModal(null)}
                style={{
                  padding: "0.5rem 1.5rem",
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {CONST_TEXT.CANCEL}
              </button>
              <button
                onClick={() => shareTask(shareModal.taskId)}
                style={{
                  padding: "0.5rem 1.5rem",
                  background: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {CONST_TEXT.SHARE}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
