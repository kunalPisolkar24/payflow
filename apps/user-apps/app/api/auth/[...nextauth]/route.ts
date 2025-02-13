import NextAuth from "next-auth";
import {authOptions} from "../../../../lib/authOptions";

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
