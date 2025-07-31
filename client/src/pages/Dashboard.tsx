/**
 * Dashboard component fetches and displays user data after login.
 *
 * Due to time constraints, this implementation handles token retrieval
 * from URL/localStorage manually and conditionally renders GitHub repos
 * or Google profile info. UI includes a loading state and a header.
 */

import { useEffect, useState } from 'react'
import api from '../services/api'

import Header from './componants/header' // Note: consider renaming to 'components'

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState({} as any)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        if (token) {
          localStorage.setItem('token', token)
          window.history.replaceState(null, '', window.location.pathname)
        }
        const storedToken = localStorage.getItem('token')
        if (!storedToken) throw new Error('No auth token found')
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
    <div style={{ width: '100%', height: '100vh' }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Header user={userDetails} />
          {userDetails[0]?.loginType === 'github' ? (
            <table className='table-striped'>
              <thead>
                <tr>
                  <th>Repo ID</th>
                  <th>Repo Name</th>
                  <th>Main Language</th>
                  <th>Forks</th>
                  <th>Updated At</th>
                  <th>Visibility</th>
                  <th>Is Private</th>
                  <th>Is Fork</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.map((repo: any) => (
                  <tr key={repo.id}>
                    <td>{repo.id}</td>
                    <td>{repo.name}</td>
                    <td>{repo.language}</td>
                    <td>{repo.forks}</td>
                    <td>{repo.updatedAt?.slice(0, 10)}</td>
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
              <p>
                <strong>Name:</strong> {userDetails[0]?.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails[0]?.email}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
