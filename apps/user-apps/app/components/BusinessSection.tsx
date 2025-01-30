"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wallet2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { useTheme } from "next-themes";

const stats = [
  {
    value: 20,
    suffix: "+",
    title: "Years of fintech excellence",
  },
  {
    value: 100,
    suffix: "+",
    title: "Countries supported globally",
  },
  {
    value: 25,
    title: "Industry awards received",
  },
  {
    value: 30,
    prefix: ">",
    suffix: "k",
    title: "Active business users",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO, FinFlow",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Adrian",
  },
  {
    name: "David Kumar",
    role: "CTO, FinFlow",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Leah", 
  },
];

export default function BusinessSection() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.5 });
  const { resolvedTheme } = useTheme();

  // Animation for the rotating box
  const boxVariants = {
    hidden: {
      rotate: 0,
    },
    visible: {
      rotate: 360,
      transition: {
        duration: 80, // Slow rotation
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  // Animation for the stats
  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    }),
  };

  return (
    <div className="relative overflow-hidden bg-background py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Transform your finances with powerful tools
              </h2>
              <p className="text-muted-foreground max-w-[600px] text-lg">
                Experience seamless financial management with our cutting-edge
                platform. Streamline payments, track expenses, and grow your
                business globally.
              </p>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              {team.map((member) => (
                <div key={member.name} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Button size="lg" className="rounded-full">
                Start your free trial
              </Button>
            </div>
          </div>

          {/* Right Content (Rotating Box) */}
          <div className="flex items-center justify-center lg:justify-end">
            <motion.div
              className="relative h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] cursor-pointer rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
              variants={boxVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Wallet2
                className="h-32 w-32"
                style={{
                  color:
                    resolvedTheme === "dark"
                      ? "var(--primary-foreground)"
                      : "var(--primary)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={statsVariants}
              initial="hidden"
              custom={index}
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col space-y-2"
            >
              <div className="text-4xl font-bold tracking-tighter">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}