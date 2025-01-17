import { PrismaClient, TransactionType } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      type,
      email, // This will be the sender's email for TRANSFER
      bank,
      accountHolderName, 
      accountNumber,
      ifscCode,
      recipientEmail, // New field for TRANSFER type
      description, // New field for description of TRANSFER
    } = await req.json();


    // Validate the amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Convert to Decimal
    const decimalAmount = new Decimal(numericAmount);

    // Make sure type is uppercase for comparison
    const transactionType = type.toUpperCase();

    if (transactionType === "DEPOSIT" || transactionType === "WITHDRAW") {
      // Get the user and their associated wallet
      const user = await prisma.user.findUnique({
        where: { email },
        include: { wallet: true },
      });

      if (!user || !user.wallet) {
        return NextResponse.json(
          { error: "User or wallet not found" },
          { status: 404 },
        );
      }

      // Perform the DEPOSIT or WITHDRAW transaction
      if (transactionType === "DEPOSIT") {
        await prisma.$transaction([
          prisma.transaction.create({
            data: {
              type: transactionType,
              amount: decimalAmount,
              userId: user.id,
              bankName: bank,
              accountNumber,
              ifscCode,
            },
          }),
          prisma.wallet.update({
            where: { id: user.wallet.id },
            data: { balance: { increment: decimalAmount } },
          }),
        ]);
      } else { // WITHDRAW
        if (user.wallet.balance.lessThan(decimalAmount)) {
          return NextResponse.json(
            { error: "Insufficient funds" },
            { status: 400 },
          );
        }

        await prisma.$transaction([
          prisma.transaction.create({
            data: {
              type: transactionType,
              amount: decimalAmount,
              userId: user.id,
              bankName: bank,
              accountNumber,
              ifscCode,
            },
          }),
          prisma.wallet.update({
            where: { id: user.wallet.id },
            data: { balance: { decrement: decimalAmount } },
          }),
        ]);
      }
    } else if (transactionType === "TRANSFER") {
      // Handle TRANSFER transaction
      if (!recipientEmail) {
        return NextResponse.json(
          { error: "Recipient email is required for transfers" },
          { status: 400 },
        );
      }

      // Get the sender and recipient users and their wallets
      const sender = await prisma.user.findUnique({
        where: { email },
        include: { wallet: true },
      });

      const recipient = await prisma.user.findUnique({
        where: { email: recipientEmail },
        include: { wallet: true },
      });

      if (!sender || !sender.wallet) {
        return NextResponse.json(
          { error: "Sender or sender's wallet not found" },
          { status: 404 },
        );
      }

      if (!recipient || !recipient.wallet) {
        return NextResponse.json(
          { error: "Recipient or recipient's wallet not found" },
          { status: 404 },
        );
      }

      // Check for sufficient funds
      if (sender.wallet.balance.lessThan(decimalAmount)) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 },
        );
      }

      // Perform the transfer using a transaction
      await prisma.$transaction([
        // Debit the sender
        prisma.wallet.update({
          where: { id: sender.wallet.id },
          data: { balance: { decrement: decimalAmount } },
        }),
        // Credit the recipient
        prisma.wallet.update({
          where: { id: recipient.wallet.id },
          data: { balance: { increment: decimalAmount } },
        }),
        // Create a transaction record for the sender
        prisma.transaction.create({
          data: {
            type: transactionType,
            amount: decimalAmount,
            userId: sender.id,
            sourceWalletId: sender.wallet.id,
            targetWalletId: recipient.wallet.id,
            description: description,
          },
        }),
      ]);
    } else {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Transaction successful" });
  } catch (error: any) {
    console.error("Transaction error:", error.message);
    return NextResponse.json(
      { error: "Transaction failed" },
      { status: 500 },
    );
  }
}