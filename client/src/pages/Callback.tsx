// Callback.tsx
// -----------------------------------------------------------------------------
// NOTE: Due to time restrictions, this component uses a simple approach with
// useEffect and react-router hooks instead of React Router's
// createBrowserRouter, createRoutesFromElements, or React Context for auth state.
//
// This is a minimal implementation to handle OAuth2 callback and token saving.
//
// Flow:
//  1. Reads `code` and `provider` from the URL query params
//  2. Calls backend /auth/callback endpoint to exchange the code for JWT
//  3. Saves the JWT
//  4. Redirects to /dashboard
// -----------------------------------------------------------------------------

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { saveToken } from '../services/auth'

export default function Callback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const provider = params.get('provider') || 'github'
    const code = params.get('code')

    if (!code) return

    async function exchangeCode() {
      try {
        const res = await api.get('/auth/callback', {
          params: { provider, code },
        })
        saveToken(res.data.jwt)
        navigate('/dashboard')
      } catch (error) {
        console.error('Login callback error:', error)
        alert('Failed to authenticate. Please try again.')
        navigate('/')
      }
    }

    exchangeCode()
  }, [params, navigate])

  return <div>Processing login...</div>
}
