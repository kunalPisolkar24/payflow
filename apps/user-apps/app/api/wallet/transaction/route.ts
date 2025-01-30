import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * @swagger
 * /api/wallet/transaction:
 *   post:
 *     summary: Perform a wallet transaction (deposit, withdraw, or transfer)
 *     description: Handles deposit, withdrawal, and transfer transactions for a user's wallet.
 *     tags:
 *       - Wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - email
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount of the transaction
 *                 example: 50.00
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, WITHDRAW, TRANSFER]
 *                 description: The type of the transaction (case-insensitive)
 *                 example: DEPOSIT
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user performing the transaction (sender for transfers)
 *                 example: user@example.com
 *               bank:
 *                 type: string
 *                 description: The name of the bank (required for DEPOSIT and WITHDRAW)
 *                 example: "State Bank of India"
 *               accountHolderName:
 *                  type: string
 *                  description: Account holder name (required for DEPOSIT and WITHDRAW)
 *               accountNumber:
 *                 type: string
 *                 description: The account number (required for DEPOSIT and WITHDRAW)
 *                 example: "1234567890"
 *               ifscCode:
 *                 type: string
 *                 description: The IFSC code (required for DEPOSIT and WITHDRAW)
 *                 example: "SBIN0001234"
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *                 description: The email address of the recipient user (required for TRANSFER)
 *                 example: recipient@example.com
 *               description:
 *                 type: string
 *                 description: A description of the transaction (optional, used for TRANSFER)
 *                 example: "Payment for services"
 *     responses:
 *       200:
 *         description: Transaction successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction successful
 *       400:
 *         description: Bad request - invalid input or insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     - Invalid amount
 *                     - Recipient email is required for transfers
 *                     - Insufficient funds
 *                     - Invalid transaction type
 *       404:
 *         description: Not found - user or wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     - User or wallet not found
 *                     - Sender or sender's wallet not found
 *                     - Recipient or recipient's wallet not found
 *       500:
 *         description: Internal server error - transaction failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Transaction failed
 */

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