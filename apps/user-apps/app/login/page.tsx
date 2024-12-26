"use client";

import { useState, useEffect, FormEvent } from "react";
import LoginForm from "@repo/ui/components/Login";
import { Loader } from "@repo/ui/components/loader";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Simulate loading the LoginForm

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate an API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Your actual API call to login endpoint, e.g.:
      // await fetch('/api/login', { method: 'POST', body: /* ... */ });
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show an error message)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isPageLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <LoginForm isLoading={isLoading} onSubmit={onSubmit} />
      )}
    </div>
  );
}