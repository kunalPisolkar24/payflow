import { PrismaClient } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      type,
      email,
      bank,
      accountHolderName, // Keeping this even though it's not in the schema
      accountNumber,
      ifscCode,
    } = await req.json();

    console.log("Request Body:", {
      amount,
      type,
      email,
      bank,
      accountHolderName,
      accountNumber,
      ifscCode
    });

    // Validate the amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }


    // Convert to Decimal
    const decimalAmount = new Decimal(numericAmount);

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

    // Make sure type is uppercase for comparison
    const transactionType = type.toUpperCase();

    // Perform the transaction
    if (transactionType === "DEPOSIT") {
      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            type: transactionType, // Use the uppercase type
            amount: decimalAmount,
            userId: user.id,
            bankName: bank,
            accountNumber,
            // accountHolderName, // Exclude this since it's not in your schema
            ifscCode,
          },
        }),
        prisma.wallet.update({
          where: { id: user.wallet.id },
          data: { balance: { increment: decimalAmount } },
        }),
      ]);
    } else if (transactionType === "WITHDRAW") {
      if (user.wallet.balance.lessThan(decimalAmount)) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 },
        );
      }

      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            type: transactionType, // Use the uppercase type
            amount: decimalAmount,
            userId: user.id,
            bankName: bank,
            accountNumber,
            // accountHolderName, // Exclude this since it's not in your schema
            ifscCode,
          },
        }),
        prisma.wallet.update({
          where: { id: user.wallet.id },
          data: { balance: { decrement: decimalAmount } },
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