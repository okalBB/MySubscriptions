import fetch from 'node-fetch'
import { processWithAI } from './ai'

export async function fetchGitHubItems(token: string) {
  const res = await fetch('https://api.github.com/user/repos', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const repos = (await res.json()) as any[]

  const aiCheck = await processWithAI(repos)
  if (!aiCheck) {
    throw new Error('Failed to process with AI')
  }
  return aiCheck
  
}

