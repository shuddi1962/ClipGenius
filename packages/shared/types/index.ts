// User types
export type UserRole = 'admin' | 'user' | 'manager' | 'editor'
export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  plan: PlanTier
  org_id: string
  created_at: string
  updated_at: string
  avatar_url?: string
  email_verified: boolean
}

// Organization types
export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  settings?: Record<string, unknown>
}

// Lead/Contact types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
export type LeadSource = 'manual' | 'apify' | 'vibeprospecting' | 'import'

export interface Lead {
  id: string
  org_id: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  status: LeadStatus
  source: LeadSource
  score?: number
  tags: string[]
  custom_fields?: Record<string, unknown>
  created_at: string
  updated_at: string
  assigned_to?: string
}

// Campaign types
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed'
export type CampaignType = 'email' | 'sms' | 'whatsapp' | 'voice' | 'social' | 'drip'

export interface Campaign {
  id: string
  org_id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  template_id?: string
  scheduled_at?: string
  started_at?: string
  completed_at?: string
  total_recipients: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  created_by: string
  created_at: string
  updated_at: string
}

// API Response wrappers
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  page: number
  limit: number
  total: number
  total_pages: number
}

// Common utility types
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface SoftDeleteEntity extends BaseEntity {
  deleted_at?: string
}
