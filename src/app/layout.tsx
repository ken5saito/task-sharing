import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/Header";
import ReduxProvider from "../components/ReduxProvider";

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
        <ReduxProvider>
          <Header />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
