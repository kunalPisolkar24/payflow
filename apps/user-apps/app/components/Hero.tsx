"use client"

import { motion } from "framer-motion"
import { Wallet2 } from 'lucide-react'
import Link from "next/link"

import { Button } from "@repo/ui/components/ui/button";

export default function Hero() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden py-24 sm:py-32">
      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-10 left-10 sm:top-20 sm:left-20 text-sm text-muted-foreground rotate-[-12deg]"
      >
        Instant
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-20 left-16 sm:bottom-32 sm:left-32 text-sm text-muted-foreground rotate-[8deg]"
      >
        Secure
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute top-12 right-12 sm:top-24 sm:right-24 text-sm text-muted-foreground rotate-[12deg]"
      >
        Reliable
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-24 right-20 sm:bottom-36 sm:right-36 text-sm text-muted-foreground rotate-[-8deg]"
      >
        Global
      </motion.div>

      {/* Main Content */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Send Payments
              <span className="text-muted-foreground"> Worldwide</span>
            </h1>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl/none flex items-center justify-center gap-2">
              10X Faster with <Wallet2 className="h-8 w-8" /> PayFlow
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
          >
            PayFlow lets you send and receive money instantly across borders, with industry-leading security
            and lightning-fast processing times.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-2"
          >
            <Button size="lg" asChild>
              <Link href="/signup">Start your free trial</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Powered by advanced blockchain technology
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

