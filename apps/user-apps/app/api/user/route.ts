// apps/user-apps/app/api/users/route.ts
import { PrismaClient } from '@repo/db/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new user
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}