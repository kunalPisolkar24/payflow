"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Wallet2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";
import { useToast } from "@repo/ui/hooks/use-toast"; // Import useToast hook
import { ToastAction } from "@repo/ui/components/ui/toast";

interface SignUpFormProps {
  isLoading: boolean;
}

export default function SignUpForm({
  isLoading: isSubmitting,
}: SignUpFormProps) {
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Use the useToast hook

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // On successful registration, attempt to sign in the user
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/", // Redirect to the homepage after sign in
        });

        if (!signInResult?.error) {
          // Show success toast
          toast({
            title: "Sign up successful",
            description: "You have successfully created an account.",
          });
        } else {
          console.error("Error signing in:", signInResult.error);
          setError(
            signInResult.error || "Failed to sign in after registration"
          );
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
        // Show error toast
        toast({
          title: "Error",
          description: errorData.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      setError("An unexpected error occurred");
      // Show error toast
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center py-12 grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-zinc-900 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1708982756246-7af9dc64b5e8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=robert-schneider-oEbU4UqhJoA-unsplash.jpg)",
            filter: "blur(4px)",
          }}
        />
        <Link
          href="/"
          className="relative z-20 flex items-center text-lg font-medium"
        >
          <Wallet2 className="mr-2 h-6 w-6" />
          PayFlow
        </Link>
        <motion.div
          className="relative z-20 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <blockquote className="space-y-2">
            <p className="text-lg">
              “PayFlow has revolutionized how we handle international payments.
              The platform's speed and security are unmatched in the industry.”
            </p>
            <footer className="text-sm">Sofia Davis, CEO of GlobalTech</footer>
          </blockquote>
        </motion.div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start your 30-day free trial. No credit card required.
            </p>
          </div>
          <Card>
            <form onSubmit={onSubmit}>
              <CardContent className="grid gap-4 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Get Started"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/",
                    })
                  }
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill={
                      resolvedTheme === "dark"
                        ? "var(--primary-foreground)"
                        : "var(--primary)"
                    }
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </CardFooter>
            </form>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              <strong> Log in</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}