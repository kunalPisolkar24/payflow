"use client";

import { FormEvent } from "react";
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

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
}

export default function LoginForm({ isLoading, onSubmit }: LoginFormProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center py-12 grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-zinc-900 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1708982756246-7af9dc64b5e8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=robert-schneider-oEbU4UqhJoA-unsplash.jpg)", // Make sure this path is correct
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
              “PayFlow has revolutionized how we handle international
              payments. The platform's speed and security are unmatched in the
              industry.”
            </p>
            <footer className="text-sm">Sofia Davis, CEO of GlobalTech</footer>
          </blockquote>
        </motion.div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to access your account.
            </p>
          </div>
          <Card>
            <form onSubmit={onSubmit}>
              <CardContent className="grid gap-4 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
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
                    placeholder="Enter your password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isLoading}
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
                  Log in with Google
                </Button>
              </CardFooter>
            </form>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              <strong>Sign up</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}