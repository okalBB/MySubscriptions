/**
 * oauthRoutes.ts
 *
 * This file handles OAuth2 login flows for both GitHub and Google.
 * Responsibilities:
 * 1. Generate provider-specific OAuth login URLs (GitHub & Google).
 * 2. Handle OAuth callback to exchange authorization codes for access tokens.
 * 3. Generate a signed JWT to pass the access token securely to the frontend.
 *
 * Notes:
 * - Google in testing environments may restrict access to sensitive scopes (e.g., Gmail).
 * - GitHub and Google use slightly different OAuth2 parameters.
 */

import { Router } from 'express'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { AUTH_PROVIDERS, JWT_SECRET_KEY } from './auth/root'

const router = Router()

/**
 * GitHub OAuth login endpoint.
 * - Generates a GitHub login URL and returns it as JSON to the frontend.
 */
router.get('/ghLogin', (req, res) => {
  const { provider } = req.query
  const cfg = AUTH_PROVIDERS[provider as string]

  if (!cfg) return res.status(400).send('Unknown provider')

  // GitHub OAuth2 URL
  const loginUrl = `${cfg.authUrl}?client_id=${cfg.clientId}
    &redirect_uri=${encodeURIComponent(cfg.redirectUri)}
    &scope=${encodeURIComponent(cfg.scope)}
    &allow_signup=true`.replace(/\s+/g, '') // Remove whitespace/newlines

  res.json({ url: loginUrl })
})

/**
 * Google OAuth login endpoint.
 * - Generates a Google login URL with consent prompt and offline access.
 * - offline access is required for refresh tokens.
 */
router.get('/googleLogin', (req, res) => {
  try {
    const { provider } = req.query
    const cfg = AUTH_PROVIDERS[provider as string]

    if (!cfg) return res.status(400).send('Unknown provider')

    let loginUrl = ''

    if (provider === 'google') {
      // Google-specific OAuth2 URL
      loginUrl = `${cfg.authUrl}?client_id=${cfg.clientId}
        &redirect_uri=${encodeURIComponent(cfg.redirectUri)}
        &response_type=code
        &scope=${encodeURIComponent(cfg.scope)}
        &access_type=offline
        &prompt=consent`.replace(/\s+/g, '')
    }

    res.json({ url: loginUrl })
  } catch (error) {
    console.error('Error in /googleLogin:', error)
    res.status(500).send('Internal Server Error')
  }
})

/**
 * OAuth2 callback endpoint for all providers.
 * 1. Exchanges the `code` received from the OAuth redirect for an access token.
 * 2. Signs the access token into a JWT for the frontend.
 * 3. Redirects the user to the dashboard with the JWT.
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, provider } = req.query as any
    const cfg = AUTH_PROVIDERS[provider]
    if (!cfg) return res.status(400).send('Unknown provider')

    // Build provider-specific token request
    let params: URLSearchParams
    let headers: Record<string, string> = { Accept: 'application/json' }

    if (provider === 'google') {
      // Google token exchange requires grant_type
      params = new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        redirect_uri: cfg.redirectUri,
        grant_type: 'authorization_code',
      })
    } else if (provider === 'github') {
      // GitHub token exchange (no grant_type needed)
      params = new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        redirect_uri: cfg.redirectUri,
      })
    } else {
      return res.status(400).send('Unsupported provider')
    }

    // Exchange code for access token
    const tokenResponse = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers,
      body: params,
    })

    if (!tokenResponse.ok) {
      return res.status(500).send('Failed to fetch access token')
    }

    const data = (await tokenResponse.json()) as any

    if (!data.access_token) {
      return res.status(500).send('No access token received')
    }

    // Create a JWT with the access token for frontend use
    const jwtToken = jwt.sign(
      { provider, accessToken: data.access_token, loginType: provider },
      JWT_SECRET_KEY!,
      { expiresIn: '1h' } // 1 hour expiry
    )

    // Redirect the user to the frontend dashboard with token
    res.redirect(`http://localhost:5173/dashboard?token=${jwtToken}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
