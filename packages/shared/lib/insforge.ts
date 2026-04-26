// InsForge server client - for backend usage only
// Uses service role key for admin operations

import { createClient, InsForgeClient } from '@insforge/sdk'

// Validate environment variables
if (!process.env.INSFORGE_URL) {
  throw new Error('INSFORGE_URL environment variable is required')
}
if (!process.env.INSFORGE_API_KEY) {
  throw new Error('INSFORGE_API_KEY environment variable is required')
}

// Create server client with service role access
const insforge: InsForgeClient = createClient({
  url: process.env.INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY,
})

export default insforge

export function createServerClient(): InsForgeClient {
  return insforge
}

export type { InsForgeClient } from '@insforge/sdk'
