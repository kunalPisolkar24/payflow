import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided name, email, and password. Also creates an associated wallet for the user.
 *     operationId: registerUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 description: The user's name (at least 3 characters).
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: The user's password (at least 8 characters).
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully. Returns the newly created user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. The request body failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: The error code.
 *                       message:
 *                         type: string
 *                         description: The error message.
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The path to the field that failed validation.
 *                   description: An array of validation error objects.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await prisma.wallet.create({
      data: {
        userId: newUser.id,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error during user registration:", error);
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
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user's ID.
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's hashed password (not returned in responses).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated.
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Internal Server Error"
 */