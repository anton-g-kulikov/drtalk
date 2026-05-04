import type { Metadata } from "next";
import "./globals.css";
import { CommentSystem } from "@/components/Comments";

export const metadata: Metadata = {
  title: "drtalk Platform",
  description: "Interactive Prototype",
};

import { VerificationProvider } from "@/components/VerificationContext";
import { VerificationManager } from "@/components/VerificationManager";
import { SubscriptionProvider } from "@/components/SubscriptionContext";
import { SubscriptionManager } from "@/components/SubscriptionManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SubscriptionProvider>
          <VerificationProvider>
            <CommentSystem>
              {children}
              <VerificationManager />
              <SubscriptionManager />
            </CommentSystem>
          </VerificationProvider>
        </SubscriptionProvider>
      </body>
    </html>
  );
}
