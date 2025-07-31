import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { fetchGitHubItems } from './services/github'
import { fetchGoogleItems } from './services/google'
import { JWT_SECRET_KEY } from './auth/root'


const router = Router()

// Simple auth middleware
router.use((req, res, next) => {
  const auth = req.headers.authorization

  if (!auth) return res.status(401).send('Missing token')

  try {
    ;(req as any).user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!)
    next()
  } catch {
    res.status(401).send('Invalid token')
  }
})




router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send('No token provided')

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET_KEY!) as any
    const { provider, accessToken } = decoded

    if (!provider || !accessToken) {
      return res.status(400).send('Invalid token payload')
    }

    let items: any

    if (provider === 'github') {
      // Example: fetch repos or user info
      items = await fetchGitHubItems(accessToken) as any
    } else if (provider === 'google') {
      // Example: fetch Google profile info
      const profile = await fetchGoogleItems(accessToken)
      items = [profile]
    } else {
      return res.status(400).send('Unsupported provider')
    }

    if (!items || items.length === 0) {
      return res.status(404).send('No items found')
    }

    res.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).send('Server error')
  }
})



export default router
