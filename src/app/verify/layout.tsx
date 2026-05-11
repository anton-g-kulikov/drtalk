import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identity Verification | drtalk",
  description: "Verify your identity to access PHI and process referrals.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
