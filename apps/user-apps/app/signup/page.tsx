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
    }, 500); 

    if (status === "authenticated" && session) {
      router.push("/dashboard"); 
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