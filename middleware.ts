import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // /tasks配下のページはログイン必須
  if (request.nextUrl.pathname.startsWith("/tasks")) {
    if (!token) {
      // ログインしていない場合はログインページへリダイレクト
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*"],
};
