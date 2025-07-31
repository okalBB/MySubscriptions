/**
 * processWithAI.ts
 *
 * This module connects to OpenAI's API to generate AI-powered summaries of items.
 * In this case, it takes an array of GitHub repository data and asks the AI
 * to summarize it in a structured JSON format.
 *
 * Key Features:
 * 1. Uses OpenAI's `chat.completions.create` endpoint.
 * 2. Summarizes GitHub repository data into a JSON object.
 * 3. Handles repeated users by grouping their repositories.
 * 4. Returns a clean JSON string with no additional text.
 */

import OpenAI from 'openai' // Import OpenAI SDK

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

/**
 * Processes an array of items (GitHub repositories) with AI to generate summaries.
 * @param items - An array of repository objects fetched from GitHub.
 * @returns A string containing AI-generated JSON summary.
 */
export async function processWithAI(items: any[]) {
  // Call OpenAI Chat Completions API
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Chosen OpenAI model (fast + cost-efficient)
    max_tokens: 1000, // Max tokens for the summary response
    temperature: 0.7, // Slight creativity in summarization
    messages: [
      {
        role: 'user',
        content: `
You are an AI assistant that summarizes GitHub repositories. 
You will receive an array of repository objects in JSON format. 
Your task is to:
1. Extract all relevant repository data.
2. Return a single JSON object without any extra text.
3. If a username appears multiple times:
   - Create one user object with their info.
   - Collect all their repositories in an array called "projects".
4. If the username appears only once:
   - Return a single user object with an array of their projects.
   
Here is the list of repositories:
${JSON.stringify(items, null, 2)}
        `,
      },
    ],
  })

  // If OpenAI response is empty, throw an error
  if (!response.choices || response.choices.length === 0) {
    throw new Error('AI processing failed')
  }

  // Return AI-generated JSON summary (or fallback if unavailable)
  return response.choices[0].message?.content ?? 'No summary available'
}
