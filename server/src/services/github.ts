/**
 * fetchGitHubItems.ts
 *
 * This module is responsible for:
 * 1. Fetching a user's GitHub repositories using their OAuth token.
 * 2. Passing the retrieved repository data to an AI function for summarization.
 * 3. Returning AI-generated insights in JSON format.
 *
 * How it works:
 * - Accepts a GitHub OAuth token as input.
 * - Calls GitHub's `/user/repos` endpoint to fetch the user's repositories.
 * - Passes the repository array to `processWithAI` to generate summaries.
 * - Returns the AI-processed summary.
 */

import fetch from 'node-fetch' // Import fetch for Node.js
import { processWithAI } from './ai' // Import AI processing function

/**
 * Fetches GitHub repositories and generates AI-powered summaries.
 *
 * @param token - GitHub OAuth access token.
 * @returns A JSON string with summarized repository data.
 */
export async function fetchGitHubItems(token: string) {
  // 1. Call GitHub API to fetch user's repositories
  const res = await fetch('https://api.github.com/user/repos', {
    headers: { Authorization: `Bearer ${token}` }, // Auth header required
  })

  // 2. Parse the response into a JavaScript object (array of repos)
  const repos = (await res.json()) as any[]

  // 3. Pass the repository list to AI for summarization
  const aiCheck = await processWithAI(repos)

  // 4. Ensure we got a valid AI response
  if (!aiCheck) {
    throw new Error('Failed to process with AI')
  }

  // 5. Return AI-generated summary
  return aiCheck
}
