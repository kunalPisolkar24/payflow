"use client";

import { signOut } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";

const LogoutButton:React.FC = () => {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
      Logout
    </Button>
  );
}

export default LogoutButton;