import NextAuth from "next-auth";
import type { NextAuthOptions, User, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@repo/db/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

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
        const emailSchema = z.string().email();
        const passwordSchema = z.string().min(8);

        try {
          const validEmail = emailSchema.parse(credentials?.email);
          const validPassword = passwordSchema.parse(credentials?.password);

          const user = await prisma.user.findUnique({
            where: { email: validEmail },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            validPassword,
            user.password,
          );

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Validation or authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "credentials") {
        if (!user.id) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
              },
            });
          }
        }
      } else if (account?.provider === "google") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              emailVerified: new Date(),
              image: user.image,
            },
          });

          await prisma.wallet.create({
            data: {
              userId: existingUser.id,
            },
          });
        }
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: Number(existingUser.id),
            provider: "google",
            providerAccountId: profile?.sub!,
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: Number(existingUser.id),
              type: "oauth",
              provider: "google",
              providerAccountId: profile?.sub!,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
        } as User;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };