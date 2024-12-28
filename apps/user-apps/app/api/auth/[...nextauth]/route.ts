import NextAuth from "next-auth";
import type { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@repo/db/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials, req) {
        // Validate input with Zod
        const emailSchema = z.string().email();
        const passwordSchema = z.string().min(8);

        try {
          const validEmail = emailSchema.parse(credentials?.email);
          const validPassword = passwordSchema.parse(credentials?.password);

          const user = await prisma.user.findUnique({
            where: { email: validEmail },
          });

          if (!user || !user.password) {
            return null; // User not found or password not set
          }

          // Compare the password with the hashed password in the database
          const passwordsMatch = await bcrypt.compare(validPassword, user.password);

          if (!passwordsMatch) {
            return null; // Invalid password
          }

          // Return the user object that matches the expected type
          return {
            id: user.id.toString(), // Ensure the id is a string
            name: user.name,
            email: user.email,
          } as User;
        } catch (error) {
          console.error("Validation or authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Check if the sign-in is via credentials
      if (account?.provider === "credentials") {
        // If it's a new user (no user.id), find the user by email and merge data
        if (!user.id) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (existingUser) {
            // If a user with this email exists, merge the data
            // This step assumes your `user` object from credentials has the `name` property
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name, // Ensure 'name' is included from the credentials
                // Add other fields to update if necessary
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, user }) {
      session.user = user; // Customize session object as needed
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
