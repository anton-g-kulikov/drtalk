import type { Metadata } from "next";
import "./globals.css";
import { CommentSystem } from "@/components/Comments";

export const metadata: Metadata = {
  title: "drtalk Platform",
  description: "Interactive Prototype",
};

import { VerificationProvider } from "@/components/VerificationContext";
import { VerificationManager } from "@/components/VerificationManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <VerificationProvider>
          <CommentSystem>
            {children}
            <VerificationManager />
          </CommentSystem>
        </VerificationProvider>
      </body>
    </html>
  );
}
