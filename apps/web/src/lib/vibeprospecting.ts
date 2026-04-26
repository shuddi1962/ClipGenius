// VibeProspecting API integration
const VIBE_API_BASE = 'https://api.vibeprospecting.com/v1'

interface VibeLead {
  first_name: string
  last_name: string
  email: string
  phone?: string
  company: string
  title?: string
  industry?: string
  location?: string
  linkedin_url?: string
  website?: string
}

interface VibeSearchParams {
  industry?: string
  location?: string
  company_size?: string
  title?: string
  keywords?: string
  limit?: number
}

class VibeProspectingAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchLeads(params: VibeSearchParams): Promise<VibeLead[]> {
    const queryParams = new URLSearchParams()

    if (params.industry) queryParams.set('industry', params.industry)
    if (params.location) queryParams.set('location', params.location)
    if (params.company_size) queryParams.set('company_size', params.company_size)
    if (params.title) queryParams.set('title', params.title)
    if (params.keywords) queryParams.set('keywords', params.keywords)
    if (params.limit) queryParams.set('limit', params.limit.toString())

    const response = await fetch(`${VIBE_API_BASE}/leads/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`VibeProspecting API error: ${response.status}`)
    }

    const data = await response.json()
    return data.leads || []
  }

  async enrichLead(email: string): Promise<VibeLead | null> {
    const response = await fetch(`${VIBE_API_BASE}/leads/enrich`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.lead || null
  }
}

export { VibeProspectingAPI, type VibeLead, type VibeSearchParams }