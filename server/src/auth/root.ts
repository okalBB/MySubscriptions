/**
 * auth/root.ts
 *
 * This file handles:
 * 1. Loading environment variables.
 * 2. Exporting the JWT secret for signing and verifying tokens.
 * 3. Declaring OAuth2 provider configurations (GitHub and Google).
 *
 * Notes:
 * - Make sure to provide a `.env` file with all required variables.
 * - Google Gmail access may require production OAuth verification.
 * - GitHub scopes: 'repo user' to fetch repositories and user info.
 * - Google scopes: user profile, email, and Gmail read-only.
 */

import dotenv from 'dotenv'

// Load .env file variables into process.env
dotenv.config({ path: '.env' })

// Export JWT secret for signing tokens
export const JWT_SECRET_KEY = process.env.JWT_SECRET!

/**
 * OAuth provider configuration map
 * - Keys match the "provider" query param used in your routes.
 * - Each provider contains:
 *   clientId, clientSecret, authUrl, tokenUrl, redirectUri, scope
 */
export const AUTH_PROVIDERS: Record<string, any> = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!, // OAuth Client ID for GitHub
    clientSecret: process.env.GITHUB_CLIENT_SECRET!, // OAuth Client Secret for GitHub
    authUrl: 'https://github.com/login/oauth/authorize', // Authorization endpoint
    tokenUrl: 'https://github.com/login/oauth/access_token', // Token exchange endpoint
    redirectUri: 'http://localhost:4000/api/auth/callback?provider=github', // Must match GitHub OAuth app config
    scope: 'repo user', // Scope for reading user repos and profile
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!, // OAuth Client ID for Google
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // OAuth Client Secret for Google
    authUrl: 'https://accounts.google.com/o/oauth2/auth', // Google OAuth2 authorization endpoint
    tokenUrl: 'https://oauth2.googleapis.com/token', // Google OAuth2 token exchange
    redirectUri: 'http://localhost:4000/api/auth/callback?provider=google', // Must match Google OAuth2 settings
    // ⚠ NOTE:
    // - userinfo.profile + userinfo.email → Basic profile & email
    // - gmail.readonly → Read-only access to Gmail
    // - In testing mode, Gmail access may still be restricted
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly',
  },
}
