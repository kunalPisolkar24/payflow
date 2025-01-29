import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@repo/db";

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get user transactions
 *     description: Retrieves a list of formatted transactions for the currently authenticated user, including deposits, withdrawals, and transfers.
 *     operationId: getUserTransactions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's formatted transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized. The user is not authenticated or the session is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or wallet not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The transaction ID.
 *         type:
 *           type: string
 *           enum: [deposit, withdraw, transfer]
 *           description: The type of transaction.
 *         amount:
 *           type: number
 *           format: float
 *           description: The transaction amount.
 *         description:
 *           type: string
 *           description: The transaction description.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The transaction timestamp.
 *         bankName:
 *           type: string
 *           nullable: true
 *           description: The bank name (for deposit/withdraw).
 *         accountNumber:
 *           type: string
 *           nullable: true
 *           description: The last 4 digits of the account number (for deposit/withdraw).
 *         senderName:
 *           type: string
 *           nullable: true
 *           description: The sender's name (for transfers).
 *         recipientName:
 *           type: string
 *           nullable: true
 *           description: The recipient's name (for transfers).
 *         status:
 *          type: string
 *          enum: [completed, pending, failed]
 *          description: The status of transaction.
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Internal Server Error"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */