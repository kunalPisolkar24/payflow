"use client";

import { useState, useEffect, FormEvent } from "react";
import SignUpForm from "@repo/ui/components/Signup";
import { Loader } from "@repo/ui/components/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Simulate loading the SignUpForm

    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to dashboard if already authenticated
    }

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div>
      {isPageLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <SignUpForm isLoading={false} />
      )}
    </div>
  );
}