// Header.tsx
// -----------------------------------------------------------------------------
// This component displays the top header bar of the MySubscriptions dashboard.
// It shows:
//  - The user's avatar (GitHub or Google profile picture)
//  - The username (GitHub login or Google name)
//  - The app title: "MySubscriptions"
//  - A Logout button that clears the token using the `logout` service
// -----------------------------------------------------------------------------

import { logout } from '../../services/auth'

interface HeaderProps {
  user: [
    {
      avatar_url: string
      username: string
      id: number
      owner?: { avatarUrl: string; login: string } // for GitHub repo owners
    }
  ]
}

const Header = (props: HeaderProps) => {
  const currentUser = props.user[0]

  // Determine the correct avatar URL:
  const avatarUrl = currentUser.avatar_url || currentUser.owner?.avatarUrl || ''

  // Determine the display name:
  const displayName =
    currentUser.username || currentUser.owner?.login || 'Unknown User'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f536',
        borderBottom: '#f5f5f519 solid 1px',
        width: '100%',
        height: '50px',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      {/* User Avatar */}
      <img
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
        }}
        src={avatarUrl}
        alt={displayName}
      />

      {/* Username */}
      <p style={{ margin: '0 1rem' }}>{displayName}</p>

      {/* App Title */}
      <h3 style={{ margin: 0 }}>MySubscriptions</h3>

      {/* Logout button */}
      <button onClick={logout} style={{ marginLeft: 'auto' }}>
        Logout
      </button>
    </div>
  )
}

export default Header
