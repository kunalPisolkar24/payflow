import { NextRequest, NextResponse } from "next/server";

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