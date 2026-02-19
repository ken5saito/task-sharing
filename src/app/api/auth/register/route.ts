import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/firebase-auth";
import { CONST_TEXT } from "@/utils/const-text";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, passwordConfirm } = body;

    // バリデーション
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: CONST_TEXT.EMAIL_NAME_PASSWORD_REQUIRED },
        { status: 400 },
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: CONST_TEXT.PASSWORD_MISMATCH },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: CONST_TEXT.PASSWORD_MIN_LENGTH },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: CONST_TEXT.INVALID_EMAIL },
        { status: 400 },
      );
    }

    // ユーザーを作成
    const user = await createUser(email, name, password);

    return NextResponse.json(
      {
        message: CONST_TEXT.REGISTER_SUCCESS,
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);

    // エラーメッセージに応じた応答
    if (
      error instanceof Error &&
      error.message?.includes("既に登録されています")
    ) {
      return NextResponse.json(
        { error: CONST_TEXT.EMAIL_ALREADY_REGISTERED },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: CONST_TEXT.REGISTER_ERROR },
      { status: 500 },
    );
  }
}
