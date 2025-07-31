import { useEffect, useState } from 'react'
import api from '../services/api'

import Header from './componants/header'



export default function Dashboard() {
  const [userDetails, setUserDetails] = useState({} as any)
  const [loading, setLoading] = useState(true)

  // when the page load need to check if the url has a token
 useEffect(() => {
   async function fetchItems() {
     try {
       setLoading(true)

       // 1. Extract token from URL
       const urlParams = new URLSearchParams(window.location.search)
       const token = urlParams.get('token')

       // 2. Store token if exists
       if (token) {
         localStorage.setItem('token', token)
         // Clean URL
         window.history.replaceState(null, '', window.location.pathname)
       }

       // 3. Use token from localStorage for API call
       const storedToken = localStorage.getItem('token')
       if (!storedToken) {
         throw new Error('No auth token found')
       }

       // 4. Make authenticated request WITHOUT provider param
       const res = await api.get('/items', {
         headers: { Authorization: `Bearer ${storedToken}` },
       })

       setUserDetails(res.data)
     } catch (error) {
       console.error('Failed to fetch items:', error)
     } finally {
       setLoading(false)
     }
   }

   fetchItems()
 }, [])






  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Header user={userDetails} />
          {userDetails[0].loginType === 'github' ? (
          <table className='table-striped'>
            <thead>
              <tr>
                <th>Repo Name</th>
                <th>Username</th>
                <th>Main Language</th>
                <th>forks</th>
                <th>update at</th>
                <th>created at</th>
                <th>visibility</th>
                <th>is private</th>
                <th>is fork</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((repo: any) => (
                <tr key={repo.id}>
                  <td>{repo.id}</td>
                  <td>{repo.name}</td>
                  <td>{repo.language}</td>
                  <td>{repo.forks}</td>
                  <td>{repo.updatedAt.slice(0, 10)}</td>

                  <td>{repo.visibility}</td>
                  <td>{repo.isPrivate ? 'Yes' : 'No'}</td>
                  <td>{repo.isFork ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div>
              <h2>User Profile</h2>
               <p><strong>Name:</strong> {userDetails[0].username}</p>
              <p><strong>Email:</strong> {userDetails[0].email}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}