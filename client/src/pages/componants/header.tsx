

import { logout } from '../../services/auth'

const Header = (props: {
  user: [
    {
      avatar_url: string
      username: string
      id: number
      owner?: { avatarUrl : string; login: string }
    }
  ]
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f536',
        borderBottom: '#f5f5f519',
        width: '100%',
        height: '50px',
        justifyContent: 'space-between',
      }}
    >
      <img
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          marginLeft: '2rem',
        }}
        src={
          props.user[0].avatar_url
            ? props.user[0].avatar_url
            : props.user[0].owner?.avatarUrl
        }
        alt={props.user[0].username ? props.user[0].username : props.user[0].owner?.login}
      />
      <p>{props.user[0].username ? props.user[0].username : props.user[0].owner?.login}</p>
      <h3>MySubscriptions</h3>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Header;