"use client";

import { useState, useEffect } from "react";
import LoginForm from "@repo/ui/components/Login";
import { Loader } from "@repo/ui/components/loader";
import { useRouter } from "next/navigation"; // Import useRouter
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter(); // Use the useRouter hook
  const { data: session, status } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Simulate loading the LoginForm

    if (status === "authenticated") {
      router.push("/dashboard");
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
        <LoginForm isLoading={false} />
      )}
    </div>
  );
}