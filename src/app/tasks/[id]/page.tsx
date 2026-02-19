"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // 未認証時はリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // タスクを取得（初回マウント時のみ）
  useEffect(() => {
    if (status === "authenticated" && !hasFetched) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("/api/tasks");
          if (response.ok) {
            const tasks: Task[] = await response.json();
            const foundTask = tasks.find((t) => t.id === taskId);
            if (foundTask) {
              setTask(foundTask);
              setEditTitle(foundTask.title);
              setEditCategory(foundTask.category);
              setEditAssignee(foundTask.assignee);
              setEditMemo(foundTask.memo);
              setHasFetched(true);
            }
          }
        } catch (err) {
          console.error("Failed to fetch task:", err);
          setError(CONST_TEXT.TASK_FETCH_FAILED);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    }
  }, [status, taskId, hasFetched]);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          title: editTitle,
          category: editCategory,
          assignee: editAssignee,
          memo: editMemo,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        // 編集フィールドも同時に更新して、次の編集のための値を保持
        setEditTitle(updatedTask.title);
        setEditCategory(updatedTask.category);
        setEditAssignee(updatedTask.assignee);
        setEditMemo(updatedTask.memo);
        setIsEdit(false);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
      setError(CONST_TEXT.TASK_UPDATE_FAILED);
    }
  };

  const handleToggleCompleted = async () => {
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        // 編集フィールドも同時に更新
        setEditTitle(updatedTask.title);
        setEditCategory(updatedTask.category);
        setEditAssignee(updatedTask.assignee);
        setEditMemo(updatedTask.memo);
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
      setError(CONST_TEXT.TASK_UPDATE_FAILED);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm(CONST_TEXT.DELETE_CONFIRM)) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/tasks");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(CONST_TEXT.TASK_DELETE_FAILED);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <p>{CONST_TEXT.LOADING}</p>
      </main>
    );
  }

  if (!task) {
    return (
      <main style={{ padding: "2rem" }}>
        <h2 style={{ color: "#ef4444" }}>{CONST_TEXT.NO_TASKS}</h2>
        <Link href="/tasks" style={{ color: "#6366f1", fontWeight: "bold" }}>
          {CONST_TEXT.BACK_TO_LIST}
        </Link>
      </main>
    );
  }

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
        {CONST_TEXT.TASK_DETAIL}
      </h2>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          boxShadow: "0 2px 12px rgba(99,102,241,0.12)",
          marginBottom: "2rem",
          maxWidth: "560px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {isEdit ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{
                fontWeight: "bold",
                fontSize: "1.3rem",
                color: "#6366f1",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "0.5rem",
                flex: 1,
              }}
              required
            />
          ) : (
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#6366f1",
              }}
            >
              {task.title}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.4em 1.2em",
                borderRadius: "999px",
                background: task.completed ? "#10b981" : "#f59e42",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                minWidth: "90px",
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
            <button
              onClick={handleToggleCompleted}
              style={{
                padding: "0.45em 1em",
                borderRadius: "8px",
                border: "none",
                background: task.completed ? "#f59e42" : "#10b981",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.95rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                transition: "background 0.2s",
                minWidth: "110px",
              }}
            >
              {task.completed
                ? CONST_TEXT.MARK_AS_INCOMPLETE
                : CONST_TEXT.MARK_AS_COMPLETE}
            </button>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                color: "#6366f1",
                fontWeight: "bold",
                fontSize: "1.05rem",
              }}
            >
              {CONST_TEXT.CATEGORY}:
            </label>
            {isEdit ? (
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{
                  marginLeft: "0.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "0.4rem",
                  fontSize: "1rem",
                  width: "60%",
                }}
                required
              />
            ) : (
              <span style={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
                {task.category}
              </span>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                color: "#6366f1",
                fontWeight: "bold",
                fontSize: "1.05rem",
              }}
            >
              {CONST_TEXT.ASSIGNEE}:
            </label>
            {isEdit ? (
              <input
                type="text"
                value={editAssignee}
                onChange={(e) => setEditAssignee(e.target.value)}
                style={{
                  marginLeft: "0.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "0.4rem",
                  fontSize: "1rem",
                  width: "60%",
                }}
                required
              />
            ) : (
              <span style={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
                {task.assignee}
              </span>
            )}
          </div>
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "8px",
              padding: "1rem",
              color: "#374151",
              fontSize: "1rem",
              minHeight: "60px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#6366f1" }}>
              {CONST_TEXT.MEMO_LABEL}
            </span>
            {isEdit ? (
              <textarea
                value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  minHeight: "60px",
                  resize: "vertical",
                }}
              />
            ) : (
              task.memo
            )}
          </div>
          {isEdit ? (
            <form
              onSubmit={handleSave}
              style={{ display: "flex", gap: "1rem" }}
            >
              <button
                type="submit"
                style={{
                  padding: "0.6em 1.5em",
                  borderRadius: "8px",
                  border: "none",
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(99,102,241,0.10)",
                  transition: "background 0.2s",
                }}
              >
                {CONST_TEXT.SAVE}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "0.6em 1.5em",
                  borderRadius: "8px",
                  border: "none",
                  background: "#e5e7eb",
                  color: "#6366f1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(99,102,241,0.10)",
                  transition: "background 0.2s",
                }}
              >
                {CONST_TEXT.CANCEL}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  padding: "0.6em 1.5em",
                  borderRadius: "8px",
                  border: "none",
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(99,102,241,0.10)",
                  transition: "background 0.2s",
                }}
              >
                {CONST_TEXT.EDIT}
              </button>
              {task.ownerId === session?.user?.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    padding: "0.6em 1.5em",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "1rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                    transition: "background 0.2s",
                  }}
                >
                  {CONST_TEXT.DELETE}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Link href="/tasks" style={{ color: "#6366f1", fontWeight: "bold" }}>
        {CONST_TEXT.BACK_TO_LIST}
      </Link>
    </main>
  );
}
