/**
 * protectedRoutes.ts
 *
 * This file handles all routes that require authentication using JWT.
 *
 * Responsibilities:
 * 1. Verify that incoming requests have a valid JWT in the Authorization header.
 * 2. Decode the JWT to determine which provider (GitHub/Google) and access token to use.
 * 3. Fetch the user's items (e.g., GitHub repos or Google profile/emails).
 * 4. Return the fetched items as JSON.
 *
 * Notes:
 * - In a testing environment, Google may restrict Gmail access.
 *   We are currently returning only Google basic profile info for safety.
 * - JWT payload contains { provider, accessToken, loginType } from OAuth callback.
 */

import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { fetchGitHubItems } from './services/github'
import { fetchGoogleItems } from './services/google'
import { JWT_SECRET_KEY } from './auth/root'

const router = Router()

/**
 * Middleware: JWT Authentication
 * - Checks Authorization header for a Bearer token.
 * - Verifies the token using JWT_SECRET_KEY.
 * - Attaches the decoded payload to req.user for downstream handlers.
 */
router.use((req, res, next) => {
  const auth = req.headers.authorization

  if (!auth) return res.status(401).send('Missing token')

  try {
    // Strip the "Bearer " prefix and verify the token
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET_KEY!)
    ;(req as any).user = decoded
    next()
  } catch {
    res.status(401).send('Invalid token')
  }
})

/**
 * GET /
 * - Protected endpoint that returns user-specific items based on the OAuth provider.
 *
 * Flow:
 * 1. Decode JWT to get { provider, accessToken }.
 * 2. If provider = GitHub -> Fetch GitHub repositories using fetchGitHubItems().
 * 3. If provider = Google -> Fetch Google profile info using fetchGoogleItems().
 * 4. Return the fetched data as JSON.
 */
router.get('/', async (req, res) => {
  try {
    // Ensure token is provided
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send('No token provided')

    // Verify and decode the token
    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET_KEY!) as any
    const { provider, accessToken } = decoded

    // Basic validation of token payload
    if (!provider || !accessToken) {
      return res.status(400).send('Invalid token payload')
    }

    let items: any

    if (provider === 'github') {
      // Fetch GitHub repositories and pass through AI processing
      items = await fetchGitHubItems(accessToken)
    } else if (provider === 'google') {
      // Fetch Google profile info
      // ⚠ NOTE: In testing, Gmail messages may not be accessible due to OAuth limits
      items = [await fetchGoogleItems(accessToken)]
    } else {
      return res.status(400).send('Unsupported provider')
    }

    // Handle empty result sets
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return res.status(404).send('No items found')
    }

    res.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).send('Server error')
  }
})

export default router
