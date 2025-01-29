import NextAuth from "next-auth";
import type { NextAuthOptions, User, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@repo/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login`,
      },
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

/**
 * @swagger
 * /api/auth/providers:
 *   get:
 *     summary: Get available authentication providers
 *     description: Retrieves a list of configured authentication providers.
 *     operationId: getAuthProviders
 *     responses:
 *       200:
 *         description: Successful response with a list of providers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Name of the authentication provider
 *                     example: google
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/signin/{provider}:
 *   post:
 *     summary: Sign in with a specific provider
 *     description: Initiates the sign-in process using the specified authentication provider.
 *     operationId: signInWithProvider
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           example: google
 *         description: The name of the authentication provider to use.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email (for credentials provider)
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password (for credentials provider)
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully initiated sign-in; check for redirect in headers.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: url
 *             description: URL to redirect the user to for authentication.
 *       401:
 *         description: Unauthorized; invalid credentials for the 'credentials' provider.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found; specified provider does not exist or is not configured.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out the current user
 *     description: Signs out the currently authenticated user, ending their session.
 *     operationId: signOut
 *     responses:
 *       200:
 *         description: Successfully signed out; redirect to the home page.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: url
 *             description: URL to the home page.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Get the current user's session
 *     description: Retrieves the session information for the currently authenticated user.
 *     operationId: getSession
 *     responses:
 *       200:
 *         description: Successful response with the user's session data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID.
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                     image:
 *                       type: string
 *                       format: url
 *                       description: URL to the user's profile image.
 *                 expires:
 *                   type: string
 *                   format: date-time
 *                   description: The session expiry timestamp.
 *       401:
 *         description: Unauthorized; no active session found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/csrf:
 *   get:
 *     summary: Get a CSRF token
 *     description: Retrieves a CSRF token that should be included in subsequent requests to prevent cross-site request forgery.
 *     operationId: getCsrfToken
 *     responses:
 *       200:
 *         description: Successful response with the CSRF token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 *                   description: The CSRF token.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/callback/{provider}:
 *   get:
 *     summary: Handle the callback from an authentication provider
 *     description: Processes the callback from the specified authentication provider after the user has authenticated.
 *     operationId: handleAuthCallback
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           example: google
 *         description: The name of the authentication provider.
 *     responses:
 *       302:
 *         description: Redirect to the appropriate page based on successful or failed authentication.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Internal Server Error"
 */

export { handler as GET, handler as POST };
