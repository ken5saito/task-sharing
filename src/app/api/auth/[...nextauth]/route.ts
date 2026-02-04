import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

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
        // デモ用認証情報
        if (
          credentials?.email === "demo@example.com" &&
          credentials?.password === "password123"
        ) {
          return {
            id: "1",
            email: credentials.email,
            name: "Demo User",
          };
        }

        return null;
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
