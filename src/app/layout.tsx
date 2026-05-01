import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "drTalk Prototype",
  description: "Black and White Interactive Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
