import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/verify-turnstile:
 *   post:
 *     summary: Verify Turnstile Token
 *     description: Verifies the validity of a Cloudflare Turnstile token.
 *     tags:
 *       - Turnstile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The Turnstile token to verify.
 *                 example: "your_turnstile_token_here"
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Turnstile token is valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad Request - Turnstile token is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Turnstile token is required"
 *       401:
 *         description: Unauthorized - Invalid Turnstile token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid Turnstile token"
 *       500:
 *         description: Internal Server Error - Error verifying Turnstile token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Turnstile token is required" },
        { status: 400 }
      );
    }

    const isTurnstileValid = await verifyTurnstileToken(token);

    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: "Invalid Turnstile token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TURNSTILE_SECRET_KEY environment variable not set");
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: formData,
      method: "POST",
    }
  );

  const outcome = await result.json();
  return outcome.success;
}