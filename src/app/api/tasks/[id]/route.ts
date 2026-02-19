import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ref, get, update, remove } from "firebase/database";
import { database } from "@/lib/firebase";

interface FirebaseTask {
  id: string;
  title: string;
  category: string;
  assignee: string;
  memo: string;
  completed: boolean;
  createdBy: string;
  ownerId: string;
  sharedWith: Record<string, boolean>;
  createdAt: number;
  updatedAt: number;
}

// PUT: タスク更新
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = id;
    const userId = session.user.id;
    const body = await req.json();

    // タスクを取得して権限確認
    const taskRef = ref(database, `tasks/${taskId}`);
    const snapshot = await get(taskRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = snapshot.val() as FirebaseTask;

    // タスクの所有者または共有ユーザーのみアクセス可能
    const isOwner = task.ownerId === userId;
    const isShared = !!task.sharedWith?.[userId];

    if (!isOwner && !isShared) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedTask: FirebaseTask = {
      ...task,
      ...body,
      updatedAt: Date.now(),
    };

    await update(taskRef, updatedTask);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

// DELETE: タスク削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = id;
    const userId = session.user.id;

    // タスクを取得して権限確認
    const taskRef = ref(database, `tasks/${taskId}`);
    const snapshot = await get(taskRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = snapshot.val() as FirebaseTask;

    // 所有者のみ削除可能
    if (task.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await remove(taskRef);

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
