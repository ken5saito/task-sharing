"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { toggleCompleted, updateTask } from "../../../store/tasksSlice";
import { useState } from "react";

export default function TaskDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const task = useSelector((state: RootState) =>
    state.tasks.find((t) => t.id === id)
  );
  const dispatch = useDispatch();

  // 編集モード管理
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title ?? "");
  const [editCategory, setEditCategory] = useState(task?.category ?? "");
  const [editAssignee, setEditAssignee] = useState(task?.assignee ?? "");
  const [editMemo, setEditMemo] = useState(task?.memo ?? "");

  if (!task) {
    return (
      <main style={{ padding: "2rem" }}>
        <h2>タスクが見つかりません</h2>
        <Link href="/tasks">一覧に戻る</Link>
      </main>
    );
  }

  const handleEdit = () => {
    setIsEdit(true);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditAssignee(task.assignee);
    setEditMemo(task.memo);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateTask({
        ...task,
        title: editTitle,
        category: editCategory,
        assignee: editAssignee,
        memo: editMemo,
      })
    );
    setIsEdit(false);
  };

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
        タスク詳細
      </h2>
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
                fontSize: "0.95rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                transition: "background 0.2s",
                minWidth: "110px",
              }}
            >
              {task.completed ? "未完にする" : "完了にする"}
            </button>
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                color: "#6366f1",
                fontWeight: "bold",
                fontSize: "1.05rem",
              }}
            >
              カテゴリー:
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
              担当者:
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
            <span style={{ fontWeight: "bold", color: "#6366f1" }}>メモ：</span>
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
            <div style={{ display: "flex", gap: "1rem" }}>
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
                保存
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
                キャンセル
              </button>
            </div>
          ) : (
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
              編集
            </button>
          )}
        </form>
      </div>
      <Link href="/tasks" style={{ color: "#6366f1", fontWeight: "bold" }}>
        一覧に戻る
      </Link>
    </main>
  );
}
