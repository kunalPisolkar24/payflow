import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test API route
 *     description: Returns a success message.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API route test successful!"
 */
export async function GET() {
  return NextResponse.json({ message: `API route test successful!` });
}
