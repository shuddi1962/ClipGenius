import { createClient, InsForgeClient } from '@insforge/sdk'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://wk49fyqm.us-east.insforge.app'
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''

export const insforge: InsForgeClient = createClient({
  url: insforgeUrl,
  apiKey: insforgeAnonKey,
})

// Server client (for server components and API routes)
export function createServerClient(): InsForgeClient {
  return createClient({
    url: insforgeUrl,
    apiKey: insforgeAnonKey,
  })
}

// Keep supabase export for backward compatibility during transition
export const supabase = insforge

// Database types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface ContentItem {
  id: string
  user_id: string
  title: string
  content: string
  type: 'post' | 'idea' | 'script' | 'plan'
  status: 'draft' | 'ready' | 'published'
  tags: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Settings {
  id: string
  user_id: string
  ai_provider: string
  openrouter_key: string
  kie_key: string
  search_key: string
  search_provider: string
  selected_model: string
  kie_model: string
  company_name: string
  niche: string
  location: string
  tone: string
  target_audience: string
  products: string
  whatsapp: string
  website: string
  address: string
  created_at: string
  updated_at: string
}