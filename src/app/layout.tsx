import type { Metadata } from "next";
import "./globals.css";
import { CommentSystem } from "@/components/Comments";

export const metadata: Metadata = {
  title: "drtalk Platform",
  description: "Interactive Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CommentSystem>
          {children}
        </CommentSystem>
      </body>
    </html>
  );
}
