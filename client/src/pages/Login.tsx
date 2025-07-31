/**
 * Login component provides buttons to initiate OAuth login
 * with GitHub or Google. On click, it fetches the OAuth URL
 * from the backend and redirects the user to the respective
 * OAuth consent screen.
 */

import api from '../services/api'

export default function Login() {
  const handleGhLogin = async () => {
    const res = await api.get('/auth/ghLogin', {
      params: { provider: 'github' },
    })
    // Redirect user to GitHub OAuth consent screen
    window.location.href = res.data.url
  }

  const handleGoogleLogin = async () => {
    const res = await api.get('/auth/googleLogin', {
      params: { provider: 'google' },
    })
    // Redirect user to Google OAuth consent screen
    window.location.href = res.data.url
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>MySubscriptions</h1>
      <button
        style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
        onClick={handleGhLogin}
      >
        <img
          src='https://cdn-icons-png.flaticon.com/512/25/25231.png'
          alt='GitHub'
          style={{ width: '2rem', marginRight: 8 }}
        />
        Login with GitHub
      </button>
      <hr />
      <button
        style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}
        onClick={handleGoogleLogin}
      >
        <img
          src='https://cdn-icons-png.flaticon.com/512/281/281764.png'
          alt='Google'
          style={{ width: '2rem', marginRight: 8 }}
        />
        Login with Google
      </button>
    </div>
  )
}
