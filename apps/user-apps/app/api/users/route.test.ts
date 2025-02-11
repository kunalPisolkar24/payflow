import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/db";
import { GET } from "./route";

// Mock NextAuth
vi.mock("next-auth", () => {
  const actual = { getServerSession: vi.fn() };
  return {
    default: vi.fn(),
    ...actual,
  };
});

// Mock NextAuth config
vi.mock("../auth/[...nextauth]/route", () => ({
  authOptions: {
    providers: [],
  },
}));

// Mock Prisma
vi.mock("@repo/db", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

describe("GET /api/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all users except the current user", async () => {
    const mockSession = {
      user: {
        email: "current@example.com",
      },
    };
    
    // Mock users data
    const mockUsers = [
      {
        id: 1,
        name: "Test User 1",
        email: "test1@example.com",
        image: "https://example.com/image1.jpg",
      },
      {
        id: 2,
        name: "Test User 2",
        email: "test2@example.com",
        image: null,
      },
    ];

    // Setup mocks
    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    // Create mock request
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "GET",
    });

    // Execute the handler
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response instanceof NextResponse).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);

    // Verify Prisma query
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where: {
        NOT: {
          email: "current@example.com",
        },
      },
    });
  });

  it("should return 500 if database query fails", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock session
    (getServerSession as any).mockResolvedValue({
      user: { email: "current@example.com" },
    });

    // Mock Prisma error
    (prisma.user.findMany as any).mockRejectedValue(new Error("Database error"));

    // Create mock request
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "GET",
    });

    // Execute the handler
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response instanceof NextResponse).toBe(true);
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch users" });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching users:",
      expect.any(Error)
    );

    // Restore console.error
    consoleSpy.mockRestore();
  });

  it("should handle case when no session exists", async () => {
    // Mock no session
    (getServerSession as any).mockResolvedValue(null);

    // Mock users data (should still work without filtering)
    const mockUsers = [
      {
        id: 1,
        name: "Test User 1",
        email: "test1@example.com",
        image: "https://example.com/image1.jpg",
      },
    ];

    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    // Create mock request
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "GET",
    });

    // Execute the handler
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response instanceof NextResponse).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);

    // Verify Prisma query was called without email filter
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where: {
        NOT: {
          email: undefined,
        },
      },
    });
  });
});