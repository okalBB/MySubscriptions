import  { useEffect } from 'react'
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
      const res = await api.get('/auth/callback', {
        params: { provider, code },
      })
      saveToken(res.data.jwt)
      navigate('/dashboard')
    }

    exchangeCode()
  }, [params, navigate])

  return <div>Processing login...</div>
}
