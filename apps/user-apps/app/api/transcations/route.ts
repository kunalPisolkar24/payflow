import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // 1. Get the current user's ID from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch the user using the email from the session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: true, // Include the user's wallet
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.wallet) {
      return NextResponse.json(
        { error: "User wallet not found" },
        { status: 404 }
      );
    }

    // 3. Fetch relevant transactions
    let transactions: any[] = [];

    // 3.1. Deposit transactions
    const depositTransactions = await prisma.transaction.findMany({
      where: {
        type: "DEPOSIT",
        userId: user.id,
      },
    });
    transactions = transactions.concat(depositTransactions);

    // 3.2. Withdraw transactions
    const withdrawTransactions = await prisma.transaction.findMany({
      where: {
        type: "WITHDRAW",
        userId: user.id,
      },
    });
    transactions = transactions.concat(withdrawTransactions);

    // 3.3. Transfer transactions
    const transferTransactions = await prisma.transaction.findMany({
      where: {
        type: "TRANSFER",
        OR: [
          { sourceWalletId: user.wallet.id },
          { targetWalletId: user.wallet.id },
        ],
      },
      include: {
        sourceWallet: {
          include: {
            user: true,
          },
        },
        targetWallet: {
          include: {
            user: true,
          },
        },
      },
    });

    // 3.4. Add senderName and recipientName to transfer transactions
    const transferTransactionsWithNames = transferTransactions.map(
      (transaction) => {
        let senderName: string | null = null;
        let recipientName: string | null = null;

        if (transaction.sourceWalletId === user.wallet?.id) {
          senderName = "You";
          recipientName = transaction.targetWallet?.user?.name || null;
        } else if (transaction.targetWalletId === user.wallet?.id) {
          senderName = transaction.sourceWallet?.user?.name || null;
          recipientName = "You";
        }

        return {
          ...transaction,
          senderName,
          recipientName,
        };
      }
    );

    transactions = transactions.concat(transferTransactionsWithNames);

    // 4. Format transactions
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type.toLowerCase(),
      amount: transaction.amount,
      description: transaction.description,
      timestamp: transaction.timestamp.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      bankName: transaction.bankName
        ? transaction.bankName.toUpperCase()
        : null,
      accountNumber: transaction.accountNumber
        ? `****${transaction.accountNumber.slice(-4)}`
        : null,
      senderName: transaction.senderName || null,
      recipientName: transaction.recipientName || null,
      status: transaction.status,
    }));

    // 5. Sort transactions
    formattedTransactions.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // 6. Return the formatted transactions
    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}