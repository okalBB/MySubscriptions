import fetch from 'node-fetch'

export async function fetchGoogleItems(token: string) {

  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  })


  if (!res.ok) {
    throw new Error('Failed to fetch Google user info')
  }

  //// this function fetches the user's emails ids for the next step///
  const userEmails = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=is:unread',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )










  if (!userEmails.ok) {
    throw new Error('Failed to fetch Google emails')
  }

  const emails = await userEmails.json() as any
  if (!emails.messages || emails.messages.length === 0) {
    throw new Error('No unread emails found')
  }

  if (!res.ok) {
    throw new Error('Failed to fetch Google user info')
  }

  const profile = (await res.json()) as any


  return {
    loginType: 'google',
    avatar_url: profile.picture,
    username: profile.name,
    id: profile.sub,
    email: profile.email,
  }
}


