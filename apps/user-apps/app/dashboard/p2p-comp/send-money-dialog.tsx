"use client";

import { useState, useTransition } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast"; // Import useToast

interface SendMoneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function SendMoneyDialog({
  isOpen,
  onClose,
  user,
}: SendMoneyDialogProps) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast(); // Use the useToast hook

  const handleSendMoney = async () => {
    const senderEmail = session?.user?.email;
    const recipientEmail = user.email;

    if (!senderEmail) {
      console.error("Sender email not found in session");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/wallet/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "TRANSFER",
            amount: parseFloat(amount),
            email: senderEmail,
            recipientEmail: recipientEmail,
            description: `Transfer to ${user.name}`,
          }),
        });

        if (response.ok) {
          onClose();
          // Show success toast
          toast({
            title: "Success",
            description: "Transaction successful!",
          });
          router.refresh();
        } else {
          const errorData = await response.json();
          // Show error toast
          toast({
            title: "Transaction Failed",
            description: `Error: ${errorData.error}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error during transaction:", error);
        // Show error toast
        toast({
          title: "Error",
          description: "Transaction failed",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Money to {user.name}</DialogTitle>
          <DialogDescription>
            Enter the amount you want to send.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSendMoney} disabled={isPending}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}