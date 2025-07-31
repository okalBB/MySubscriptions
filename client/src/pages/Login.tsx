
import api from '../services/api'

export default function Login() {
  const handleGhLogin = async () => {
    const res = await api.get('/auth/ghLogin', {
      params: { provider: 'github' },
    })

   window.location.href = res.data.url // Redirect to GitHub OAuth
   

  }

  const handleGoogleLogin = async () => {
    const res = await api.get('/auth/googleLogin', {
      params: { provider: 'google' },
    })

    window.location.href = res.data.url // Redirect to Google OAuth
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>MySubscriptions</h1>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={handleGhLogin}
      >
        <img
          src='https://cdn-icons-png.flaticon.com/512/25/25231.png'
          alt='GitHub'
          style={{ width: '2rem', marginRight: '8px' }}
        />
        Login with GitHub
      </button>
      <hr />
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={handleGoogleLogin}
      >
        <img
          src='https://cdn-icons-png.flaticon.com/512/281/281764.png'
          alt='google'
          style={{ width: '2rem', marginRight: '8px' }}
        />
        Login with Google
      </button>
    </div>
  )
}
