import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { getUserByEmail, verifyPassword } from "@/lib/firebase-auth";
import { CONST_TEXT } from "@/utils/const-text";

interface MyToken extends JWT {
  id?: string;
}

interface Credentials {
  email?: string;
  password?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(CONST_TEXT.EMAIL_PASSWORD_REQUIRED);
        }

        try {
          // Firebase からユーザーを検索
          const user = await getUserByEmail(credentials.email);

          if (!user) {
            throw new Error(CONST_TEXT.USER_NOT_FOUND);
          }

          // パスワード検証
          const isValid = await verifyPassword(
            credentials.password,
            user.passwordHash,
          );

          if (!isValid) {
            throw new Error(CONST_TEXT.PASSWORD_INCORRECT);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User | undefined;
    }): Promise<MyToken> {
      const t = token as MyToken;
      if (user && (user as Partial<User>).id) {
        t.id = String((user as Partial<User>).id);
      }
      return t;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const t = token as MyToken;
      if (session.user) {
        (session.user as Partial<User>).id = t.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
