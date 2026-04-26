// InsForge.dev client configuration for frontend
// Uses public anon key for client-side operations

import { createClient, InsForgeClient } from '@insforge/sdk'

// Frontend uses public anon key
const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

let insforge: InsForgeClient

if (INSFORGE_URL && INSFORGE_ANON_KEY) {
  insforge = createClient({
    url: INSFORGE_URL,
    apiKey: INSFORGE_ANON_KEY,
  })
} else {
  // Development fallback - mock client
  console.warn('InsForge credentials not found, using mock client')
  
  insforge = {
    auth: {
      getUser: async () => ({ data: { user: { id: 'user_1', email: 'demo@clipgenius.com', name: 'Demo User', role: 'owner' } } }),
      getCurrentUser: async () => ({ data: { user: { id: 'user_1', email: 'demo@clipgenius.com', name: 'Demo User', role: 'owner' } } }),
      signInWithPassword: async (creds: any) => ({ data: { user: { id: 'user_1', email: creds.email, name: 'Demo User', role: 'owner' } } }),
      signUp: async (creds: any) => ({ data: { user: { id: 'user_1', email: creds.email, name: creds.name, role: 'owner' } } }),
      signInWithOAuth: async () => ({ data: { user: { id: 'user_1', email: 'demo@clipgenius.com', name: 'Demo User', role: 'owner' } } })
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: { id: `new_${Date.now()}` }, error: null }),
      update: async () => ({ data: {}, error: null }),
      upsert: async () => ({ data: { id: `new_${Date.now()}` }, error: null }),
      delete: async () => ({ data: null, error: null }),
      eq: () => ({ select: async () => ({ data: [], error: null }) }),
      gte: () => ({ select: async () => ({ data: [], error: null }) }),
      in: () => ({ select: async () => ({ data: [], error: null }) }),
      single: async () => ({ data: null, error: null }),
      order: () => ({ select: async () => ({ data: [], error: null }) }),
      limit: () => ({ select: async () => ({ data: [], error: null }) })
    })
  } as any
}

export default insforge

export function createClient(): InsForgeClient {
  return insforge
}

export type { InsForgeClient } from '@insforge/sdk'

// Legacy compatibility
export const supabase = insforge
