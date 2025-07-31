import { Router } from 'express'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { AUTH_PROVIDERS,JWT_SECRET_KEY } from './auth/root'



const router = Router()


router.get('/ghLogin', (req, res) => {
  const { provider } = req.query
  const cfg = AUTH_PROVIDERS[provider as string]

  if (!cfg) return res.status(400).send('Unknown provider')

  const loginUrl = `${cfg.authUrl}?client_id=${cfg.clientId}
    &redirect_uri=${encodeURIComponent(cfg.redirectUri)}
    &scope=${encodeURIComponent(cfg.scope)}
    &allow_signup=true`.replace(/\s+/g, '')


  res.json({ url: loginUrl })
})


router.get('/googleLogin', (req, res) => {

  
  try {
    const { provider } = req.query
    const cfg = AUTH_PROVIDERS[provider as string]

    if (!cfg) return res.status(400).send('Unknown provider')

    let loginUrl = ''

    if (provider === 'google') {
      // Google uses different OAuth2 query params
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








router.get('/callback', async (req, res) => {
  try {
    const { code, provider } = req.query as any
    const cfg = AUTH_PROVIDERS[provider]
    if (!cfg) return res.status(400).send('Unknown provider')

    // Build token request parameters per provider
    let params: URLSearchParams | string
    let headers: Record<string, string> = { Accept: 'application/json' }


    if (provider === 'google') {
      // Google expects JSON or urlencoded with grant_type
      params = new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        redirect_uri: cfg.redirectUri,
        grant_type: 'authorization_code',
      })
    } else if (provider === 'github') {
      params = new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        redirect_uri: cfg.redirectUri,
      })
    } else {
      return res.status(400).send('Unsupported provider')
    }

    // Request access token
    const tokenResponse = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers,
      body: params,
    })



    if (!tokenResponse.ok) {
      return res.status(500).send('Failed to fetch access token')
    }

    const data = await tokenResponse.json() as any

      if (!data.access_token) {
      return res.status(500).send('No access token received')
    }

    // Optional: fetch user profile here based on provider and access_token
    // ...

    const jwtToken = jwt.sign(
      { provider, accessToken: data.access_token, loginType: provider },
      JWT_SECRET_KEY!,
      { expiresIn: '1h' }
     
    )

    // Redirect with JWT to frontend
    res.redirect(`http://localhost:5173/dashboard?token=${jwtToken}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
