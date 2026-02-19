import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ref, get, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { getUserByEmail } from "@/lib/firebase-auth";
import { CONST_TEXT } from "@/utils/const-text";

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

// POST: タスクを共有
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;
    const userId = session.user.id;
    const body = await req.json();
    const { shareWithEmail, remove: isRemove } = body;

    if (!shareWithEmail) {
      return NextResponse.json(
        { error: "shareWithEmail is required" },
        { status: 400 },
      );
    }

    // メールアドレスからユーザー情報を取得
    const targetUser = await getUserByEmail(shareWithEmail);
    if (!targetUser) {
      return NextResponse.json(
        { error: CONST_TEXT.SHARE_TARGET_NOT_FOUND },
        { status: 404 },
      );
    }

    // タスクを取得して権限確認
    const taskRef = ref(database, `tasks/${taskId}`);
    const snapshot = await get(taskRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = snapshot.val() as FirebaseTask;

    // 所有者のみ共有設定可能
    if (task.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sharedWith = task.sharedWith || {};

    if (isRemove) {
      delete sharedWith[targetUser.id];
    } else {
      sharedWith[targetUser.id] = true;
    }

    await update(taskRef, {
      sharedWith,
      updatedAt: Date.now(),
    });

    const updatedTask = {
      ...task,
      sharedWith,
      updatedAt: Date.now(),
    };

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error sharing task:", error);
    return NextResponse.json(
      { error: "Failed to share task" },
      { status: 500 },
    );
  }
}
