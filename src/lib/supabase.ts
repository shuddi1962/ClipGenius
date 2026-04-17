import { createClient } from '@insforge/sdk'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://wk49fyqm.us-east.insforge.app'
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDQ2MTN9.chhPkW6KmyR--3L-0PZWe3L8I5XUaebgy6jlF6jtJ1o'

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey
})

// Server client (for server components and API routes)
export function createServerClient() {
  return createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
    isServerMode: true
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