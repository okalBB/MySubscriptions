/**
 * fetchGoogleItems.ts
 *
 * NOTE: In a testing/development environment, Google OAuth may restrict access
 * to Gmail data unless the app is verified and the scopes are approved.
 * As a result, fetching full email content (Gmail messages) is not working in testing mode.
 * For now, this function fetches basic profile info and checks for unread messages.
 *
 * Functionality:
 * 1. Fetches the Google user's profile information via OAuth token.
 * 2. Attempts to fetch the user's unread Gmail messages.
 * 3. Returns a simplified object with basic user info.
 */

import fetch from 'node-fetch'

/**
 * Fetches Google user information and attempts to fetch unread emails.
 *
 * @param token - Google OAuth access token.
 * @returns An object containing user info (and emails in production if enabled).
 */
export async function fetchGoogleItems(token: string) {
  // 1. Fetch basic Google profile info
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch Google user info')
  }

  // 2. Attempt to fetch unread Gmail messages (will fail on unverified apps)
  const userEmails = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=is:unread',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!userEmails.ok) {
    // In testing, Gmail fetch may fail due to restricted scopes.
    console.warn('Gmail fetch failed. Returning basic profile info only.')
  }

  // 3. Parse profile data
  const profile = (await res.json()) as any

  // 4. Return simplified user info
  return {
    loginType: 'google',
    avatar_url: profile.picture,
    username: profile.name,
    id: profile.sub,
    email: profile.email,
    // In production, you could attach unread emails here
  }
}
