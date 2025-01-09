"use client";

import { motion } from 'framer-motion'
import { Wallet, ArrowRight } from 'lucide-react'
import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Label } from "@repo/ui/components/ui/label"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function WalletCard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevents from error is not cleint side rendered
  if (!mounted) {
    return null;
  }

  return (
    <Card
      className={`w-full max-w-md mx-auto ${
        theme === "dark"
          ? "text-zinc-50"
          : "text-zinc-900"
      }`}
    >
      <CardHeader className="space-y-1">
        <CardTitle
          className={`text-2xl font-semibold ${
            theme === "dark" ? "text-zinc-50" : "text-zinc-900"
          }`}
        >
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <motion.div
          className={`flex items-center space-x-4 rounded-md border p-4 ${
            theme === "dark" ? "border-zinc-700" : "border-zinc-200"
          }`}
          whileHover={{
            backgroundColor:
              theme === "dark" ? "hsl(var(--muted))" : "hsl(var(--muted))",
          }}
          transition={{ duration: 0.2 }}
        >
          <Wallet
            className={`h-8 w-8 ${
              theme === "dark" ? "text-zinc-300" : "text-zinc-700"
            }`}
          />
          <div className="flex-1 space-y-1">
            <Label
              className={` ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Current Balance
            </Label>
            <motion.p
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-zinc-50" : "text-zinc-900"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              $1,234.56
            </motion.p>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`p-3 ${
              theme === "dark"
                ? "bg-zinc-900 text-zinc-50 border border-zinc-700"
                : "text-zinc-900 border border-zinc-200"
            }`}
          >
            <Label
              className={`text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Income
            </Label>
            <p className="text-lg font-semibold text-green-500">+$500.00</p>
          </Card>
          <Card
            className={`p-3 ${
              theme === "dark"
                ? "bg-zinc-900 text-zinc-50 border border-zinc-700"
                : "text-zinc-900 border border-zinc-200"
            }`}
          >
            <Label
              className={`text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Expenses
            </Label>
            <p className="text-lg font-semibold text-red-500">-$250.00</p>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            theme === "dark"
              ? "text-zinc-950"
              : "text-zinc-50 "
          }`}
          asChild
        >
          <motion.a
            href="#"
            className="inline-flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Transactions
            <ArrowRight
              className={`ml-2 h-4 w-4 ${
                theme === "dark" ? "text-zinc-950" : "text-zinc-50"
              }`}
            />
          </motion.a>
        </Button>
      </CardFooter>
    </Card>
  );
}