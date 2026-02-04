import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/Header";
import ReduxProvider from "../components/ReduxProvider";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Task Sharing",
  description: "Task sharing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <ReduxProvider>
            <Header />
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
