"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { useTheme } from "next-themes";

interface UserAvatarProps {
  name: string;
  image?: string | null;
}

export function UserAvatar({ name, image }: UserAvatarProps) {
  const { theme } = useTheme();

  return (
    <Avatar
      className={` ${
        theme === "dark" ? "text-zinc-950" : "text-zinc-50 border-zinc-400"
      }`}
    >
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-muted text-muted-foreground uppercase">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}