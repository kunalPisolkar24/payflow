// apps/user-apps/app/api/users/[id]/route.ts
import { PrismaClient } from '@repo/db/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Get a user by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// Update a user by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { email, name } = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// Delete a user by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}