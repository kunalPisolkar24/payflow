import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get user's wallet balance
 *     description: Retrieves the balance of a user's wallet based on their email.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: The email address of the user
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Successful response - returns the wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                   description: The wallet balance (as a string)
 *                   example: "123.45"
 *       400:
 *         description: Bad request - email is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: Not found - user or wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User or wallet not found
 *       500:
 *         description: Internal server error - failed to fetch balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch balance
 */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

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

    return NextResponse.json({ balance: user.wallet.balance.toString() }); 
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 },
    );
  }
}