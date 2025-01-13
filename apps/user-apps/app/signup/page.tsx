"use client";

import { useState, useEffect } from "react";
import SignUpForm from "@repo/ui/components/Signup";
import { Loader } from "@repo/ui/components/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); 

    if (status === "authenticated" && session) {
      router.push("/dashboard"); // Redirect to dashboard if already authenticated
    }

    return () => clearTimeout(timer);
  }, [status, session, router]);

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