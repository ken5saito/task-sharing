import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ref, get, set } from "firebase/database";
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

// GET: 自分のタスク取得（所有 + 共有されたタスク）
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Firebase から自分のタスク + 共有されたタスク取得
    const tasksRef = ref(database, "tasks");
    const snapshot = await get(tasksRef);

    if (!snapshot.exists()) {
      return NextResponse.json([]);
    }

    const allTasks = snapshot.val();
    const userTasks: FirebaseTask[] = [];

    for (const taskId in allTasks) {
      const task = allTasks[taskId];
      // 所有者またはシェア対象者のみ
      if (
        task.ownerId === userId ||
        (task.sharedWith && task.sharedWith[userId])
      ) {
        userTasks.push({ id: taskId, ...task });
      }
    }

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST: タスク作成
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, assignee, memo } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const taskId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newTask: FirebaseTask = {
      id: taskId,
      title,
      category: category || "",
      assignee: assignee || "",
      memo: memo || "",
      completed: false,
      createdBy: userId,
      ownerId: userId,
      sharedWith: {},
      createdAt: now,
      updatedAt: now,
    };

    const taskRef = ref(database, `tasks/${taskId}`);
    await set(taskRef, newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
