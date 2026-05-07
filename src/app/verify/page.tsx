"use client";

import { VerificationFlow } from "@/components/VerificationFlow";
import { useVerification } from "@/components/VerificationContext";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { verify } = useVerification();
  const router = useRouter();

  const handleComplete = () => {
    verify();
    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <VerificationFlow onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}
